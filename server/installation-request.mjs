import { Buffer } from 'node:buffer';
import { hasMinimumPhoneDigits } from '../src/app/shared/phone-number.ts';
import { RECIPIENT, textField } from './submission-request.mjs';

const PHOTO_LIMIT = 10 * 1024 * 1024;

export const INSTALLATION_SUBMISSION = {
  name: 'Installation',
  uploadLimit: PHOTO_LIMIT + 64 * 1024,
  createMessage: installationMessage,
};

async function installationMessage(data) {
  const name = textField(data, 'name', 80);
  const phone = textField(data, 'phone', 25);
  const objectType = textField(data, 'objectType', 80);
  const description = textField(data, 'description', 1600);

  const hasRequestDetails = Boolean(name && objectType && description);

  if (!hasRequestDetails || !hasMinimumPhoneDigits(phone)) {
    return { status: 400 };
  }

  const attachments = [];
  const photo = data.get('photo');

  if (photo !== null) {
    if (!(photo instanceof File) || photo.size === 0) {
      return { status: 400 };
    }

    if (photo.size > PHOTO_LIMIT) {
      return { status: 413 };
    }

    const content = Buffer.from(await photo.arrayBuffer());
    const extension = imageExtension(content);

    if (!extension) {
      return { status: 415 };
    }

    attachments.push({ filename: 'photo.' + extension, content });
  }

  const id = crypto.randomUUID().slice(0, 8).toUpperCase();

  return {
    id,
    message: {
      to: RECIPIENT,
      subject: 'Girlyanda · Заявка на монтаж ' + id,
      text: ['Заявка ' + id, 'Ім’я: ' + name, 'Телефон: ' + phone, 'Тип об’єкта: ' + objectType, '', description].join(
        '\n',
      ),
      attachments,
    },
  };
}

function imageExtension(content) {
  if (
    content.length >= 12 &&
    content.toString('ascii', 0, 4) === 'RIFF' &&
    content.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'webp';
  }

  if (content.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') {
    return 'png';
  }

  if (content.subarray(0, 3).toString('hex') === 'ffd8ff') {
    return 'jpg';
  }

  return '';
}
