import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';

test('головна, вкладене меню та клавіатурне порівняння', async ({page}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  await expect(page.getByRole('heading', {name: /Світло, що створює/})).toBeVisible();
  await expect(page.locator('.category-grid a')).toHaveCount(9);
  const logo = page.getByRole('banner').getByRole('link', {name: 'Girlyanda — головна'}).locator('img');
  await expect(logo).toHaveAttribute('src', '/media/brand-logo-light.svg');
  await expect(page.getByRole('contentinfo').getByRole('link', {name: 'Girlyanda — головна'}).locator('img'))
    .toHaveAttribute('src', '/media/brand-logo-light.svg');
  const slider = page.getByRole('slider', {name: 'Порівняння до і після монтажу'});
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('51');
  const comparison = page.locator('gy-compare figure');
  await expect(slider).toHaveAttribute('aria-valuetext', 'До: 51%. Після: 49%.');
  await expect(comparison.getByText('До', {exact: true})).toBeVisible();
  await expect(comparison.getByText('Після', {exact: true})).toBeVisible();
  await expect(comparison.locator('img.before')).toHaveAttribute('src', '/media/house-day.webp');
  await expect(comparison.locator('img:not(.before)')).toHaveAttribute('src', '/media/house-night.webp');
  const width = await slider.evaluate(element => element.clientWidth);
  const position = {x: Math.round(width * 0.72), y: 36};
  if (testInfo.project.name === 'mobile') await slider.tap({position});
  else await slider.click({position});
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(65);
  await expect(page.locator('.hero-video')).not.toHaveAttribute('src');

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', {name: 'Меню', exact: true}).click();
    await expect(logo).toHaveAttribute('src', '/media/brand-logo.svg');
    const nav = page.getByRole('navigation', {name: 'Мобільна навігація'});
    await nav.getByText('Каталог', {exact: true}).click();
    await nav.getByText('Бахрома', {exact: true}).click();
    await nav.getByRole('link', {name: 'Вуличні', exact: true}).click();
  } else {
    const nav = page.getByRole('navigation', {name: 'Основна навігація'});
    await nav.getByRole('button', {name: 'Каталог'}).click();
    await expect(logo).toHaveAttribute('src', '/media/brand-logo.svg');
    await page.locator('#mega-menu').getByRole('link', {name: 'Вуличні', exact: true}).click();
  }
  await expect(page).toHaveURL(/\/katalog\/bakhroma\/vulychni$/);
  await expect(logo).toHaveAttribute('src', '/media/brand-logo.svg');
  await expect(page.getByRole('heading', {name: 'Гірлянди-бахрома', exact: true})).toBeVisible();
  const fringe = page.locator('.catalog-grid');
  await expect(fringe.getByRole('heading', {name: 'Гірлянда-бахрома 3 × 0,5 м', exact: true})).toBeVisible();
  await expect(fringe.getByRole('heading', {name: 'Гірлянда-бахрома 3 × 0,5 м з мерехтінням', exact: true})).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Знайдено моделей: 2');
  await expect(page.locator('a[href="/katalog/bakhroma/interierni"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('сторінка монтажу порівнює окремий зимовий будинок', async ({page}) => {
  await page.goto('/montazh');
  const comparison = page.locator('gy-compare figure');
  await comparison.scrollIntoViewIfNeeded();
  await expect(comparison.getByText('До', {exact: true})).toBeVisible();
  await expect(comparison.getByText('Після', {exact: true})).toBeVisible();
  await expect(comparison.locator('img.before')).toHaveAttribute('src', '/media/installation-before.webp');
  await expect(comparison.locator('img:not(.before)')).toHaveAttribute('src', '/media/installation-after.webp');
  const sizes = await comparison.locator('img').evaluateAll(async images => Promise.all(images.map(async image => {
    const photo = image as HTMLImageElement;
    await photo.decode();
    return [photo.naturalWidth, photo.naturalHeight];
  })));
  expect(sizes).toEqual([[1200, 600], [1200, 600]]);
});

test('фільтр, вибір артикула, медіа й збереження замовлення', async ({page}) => {
  await page.goto('/katalog');
  await page.getByLabel('Колір світіння', {exact: true}).selectOption('white');
  await expect(page.getByRole('status')).toHaveText('Знайдено моделей: 3');
  const card = page.locator('.product-card').filter({has: page.getByRole('heading', {name: 'Гірлянда-нитка 10 м', exact: true})});
  await card.getByRole('button', {name: 'Теплий білий', exact: true}).click();
  await expect(card.locator('.card-image img')).toHaveAttribute('src', /promin-100-warm-black\.webp$/);
  await card.getByRole('heading').getByRole('link').click();
  await expect(page).toHaveURL(/\/tovar\/promin-100\?sku=GY-P100-WW-BK$/);
  expect(await page.content()).not.toMatch(/brightled|lumion/i);
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /promin-100-warm-black\.webp$/);
  await page.getByRole('group', {name: /^Колір світіння/}).getByRole('button', {name: 'Білий', exact: true}).click();
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /promin-100-white-black\.webp$/);
  await expect(page.getByText('Артикул GY-P100-WH-BK')).toBeVisible();
  await page.getByRole('group', {name: 'Колір проводу'}).getByRole('button', {name: 'Білий'}).click();
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /promin-100-white-white\.webp$/);
  await page.getByRole('group', {name: /^Колір світіння/}).getByRole('button', {name: 'Теплий білий', exact: true}).click();
  await expect(page.locator('.detail-image img')).toHaveAttribute('src', /promin-100-warm-white\.webp$/);
  await expect(page.getByText('Артикул GY-P100-WW-WH')).toBeVisible();
  await page.getByRole('button', {name: 'До кошика', exact: true}).click();
  await page.getByRole('link', {name: 'Переглянути кошик'}).click();
  await expect(page).toHaveURL(/\/koshyk$/);
  await page.reload();
  await expect(page.getByText('Кількість товарів: 1')).toBeVisible();
  await page.getByRole('button', {name: /Збільшити кількість/}).click();
  await expect(page.getByText('Кількість товарів: 2')).toBeVisible();
  await page.getByRole('link', {name: 'Оформити замовлення'}).click();
  await page.getByLabel('Ім’я').fill('Тест');
  await page.getByLabel('Телефон').fill('+380000000000');
  await page.getByLabel('Місто').fill('Київ');
  await page.getByLabel('Відділення або адреса').fill('Тестове відділення');
  await page.getByRole('button', {name: 'Зберегти замовлення'}).click();
  await expect(page.getByRole('heading', {name: /Замовлення .* збережено/})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Кошик, товарів: 0'})).toBeVisible();
});

test('окрема заявка на монтаж додає підказки й надсилає фото разом із заявкою', async ({page}) => {
  await page.goto('/kontakty');
  await expect(page.getByRole('heading', {name: 'Як вам зручно зв’язатися?', level: 1})).toBeVisible();
  await expect(page.getByRole('form', {name: 'Заявка на монтаж'})).toHaveCount(0);
  await page.getByRole('main').getByRole('link', {name: 'Заявка на монтаж'}).click();
  await expect(page).toHaveURL('/zaiavka');
  await page.getByLabel('Ім’я').fill('Тест');
  await page.getByLabel('Телефон').fill('+380000000000');
  await page.getByLabel('Тип об’єкта').selectOption('Приватний будинок');
  const description = page.getByLabel('Що потрібно підсвітити?');
  await description.fill('Карниз і терасу');
  const treeIdea = page.getByRole('button', {name: 'Дерева й кущі', exact: true});
  await treeIdea.click();
  await expect(description).toBeFocused();
  const textWithBrief = [
    'Карниз і терасу',
    '',
    'Дерева й кущі',
    'Світлова нитка навколо стовбура й гілок.',
    'Колір світіння ________',
    'Колір проводу ________',
    'Кількість дерев або кущів ________',
    'До якої висоти підсвітити (м) ________',
  ].join('\n');
  await expect(description).toHaveValue(textWithBrief);
  await page.keyboard.insertText('теплий білий');
  const textWithColor = textWithBrief.replace('Колір світіння ________', 'Колір світіння теплий білий');
  await expect(description).toHaveValue(textWithColor);
  await treeIdea.click();
  await expect(description).toHaveValue(textWithColor);
  await page.locator('input[type="file"]').setInputFiles(resolve('public/media/house-after.webp'));
  await expect(page.getByRole('img', {name: 'Попередній перегляд фото об’єкта'})).toBeVisible();
  const submit = page.getByRole('button', {name: 'Надіслати заявку'});
  await page.route('**/api/installation', route => route.fulfill({status: 502}), {times: 1});
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('Надіслати заявку не вдалося');
  await expect(page.getByRole('link', {name: 'Відкрити підготовлений лист'}))
    .toHaveAttribute('href', /^mailto:umt1@ukr\.net\?/);
  await expect(description).toHaveValue(textWithColor);
  await expect(page.getByRole('img', {name: 'Попередній перегляд фото об’єкта'})).toBeVisible();

  await page.route('**/api/installation', route => route.fulfill({status: 201, json: {id: 'ABCDEF01'}}));
  const [request] = await Promise.all([
    page.waitForRequest(request => request.url().endsWith('/api/installation') && request.method() === 'POST'),
    submit.click(),
  ]);
  const data = await new Request(request.url(), {
    method: request.method(),
    headers: request.headers(),
    body: new Uint8Array(request.postDataBuffer()!),
  }).formData();
  expect(String(data.get('description')).replaceAll('\r\n', '\n')).toBe(textWithColor);
  expect(data.get('photo')).toMatchObject({name: 'house-after.webp', type: 'image/webp'});
  await expect(page.getByRole('status')).toContainText('Заявку ABCDEF01 надіслано.');
  await expect(description).toHaveValue('');
});

test('галерея робіт дозволяє збільшити фото та перегорнути його', async ({page}) => {
  await page.goto('/roboty');
  await page.getByRole('button', {name: 'Збільшити фото: Заміський будинок'}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading')).toHaveText('Заміський будинок');
  await dialog.getByRole('button', {name: 'Наступне', exact: true}).click();
  await expect(dialog.getByRole('heading')).toHaveText('Будинок із кам’яним фасадом');
  await dialog.getByRole('button', {name: 'Закрити'}).click();
  await expect(dialog).not.toBeVisible();
});

test('картки на головній відкривають окремі галереї з фото та відео', async ({page}) => {
  const categories = [
    {title: 'Заміські будинки', slug: 'zamiski-budynky', photo: 'Заміський будинок', video: 'Фасад і вхід у вечірньому світлі', source: '/media/hero.webm'},
    {title: 'Комерційні об’єкти', slug: 'komertsiini-obiekty', photo: 'Вхід до готелю', video: 'Вітрина кафе у сутінках', source: '/media/portfolio-cafe.webm'},
    {title: 'Простори, дерева й ялинки', slug: 'prostory-dereva-yalynky', photo: 'Святкова ялинка в саду', video: 'Тераса в саду', source: '/media/portfolio-terrace.webm'},
  ];

  for (const category of categories) {
    await page.goto('/');
    await page.locator('a.project-card').filter({hasText: category.title}).click();
    await expect(page).toHaveURL('/roboty/' + category.slug);
    await expect(page.getByRole('heading', {level: 1, name: category.title})).toBeVisible();
    await expect(page.locator('.project-grid article')).toHaveCount(3);
    await expect(page.getByRole('heading', {level: 2, name: category.photo})).toBeVisible();
    await expect(page.locator('video')).toHaveCount(0);

    await page.getByRole('button', {name: 'Відкрити відео: ' + category.video}).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading')).toHaveText(category.video);
    const video = dialog.locator('video');
    await expect(video).toHaveAttribute('src', category.source);
    await expect(video).toHaveAttribute('controls', '');
    await video.evaluate(async element => {
      const player = element as HTMLVideoElement;
      player.muted = true;
      await player.play();
    });
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
    await dialog.getByRole('button', {name: 'Закрити'}).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator('video')).toHaveCount(0);
  }
  await page.getByRole('navigation', {name: 'Категорії робіт'}).getByRole('link', {name: 'Комерційні об’єкти'}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'Комерційні об’єкти'})).toBeVisible();
  await expect(page.getByRole('heading', {level: 2, name: 'Вхід до готелю'})).toBeVisible();
});
