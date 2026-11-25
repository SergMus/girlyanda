import { Buffer } from 'node:buffer';

export const recipient = 'umt1@ukr.net';
const photoLimit = 10 * 1024 * 1024;
export const uploadLimit = photoLimit + 64 * 1024;

export async function installationMessage(data) {
  const name = textField(data, 'name', 80);
  const phone = textField(data, 'phone', 25);
  const objectType = textField(data, 'objectType', 80);
  const description = textField(data, 'description', 1600);
  if (!name || !phone || phone.replace(/\D/g, '').length < 7 || !objectType || !description) {
    return {status: 400};
  }

  const attachments = [];
  const photo = data.get('photo');
  if (photo !== null) {
    if (!(photo instanceof File) || photo.size === 0) return {status: 400};
    if (photo.size > photoLimit) return {status: 413};
    const content = Buffer.from(await photo.arrayBuffer());
    const extension = imageExtension(content);
    if (!extension) return {status: 415};
    attachments.push({filename: 'photo.' + extension, content});
  }

  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  return {
    id,
    message: {
      to: recipient,
      subject: 'Girlyanda · Заявка на монтаж ' + id,
      text: [
        'Заявка ' + id,
        'Ім’я: ' + name,
        'Телефон: ' + phone,
        'Тип об’єкта: ' + objectType,
        '',
        description,
      ].join('\n'),
      attachments,
    },
  };
}

function textField(data, key, maxLength) {
  const value = data.get(key);
  if (typeof value !== 'string' || value.length > maxLength) return '';
  return value.trim();
}

function imageExtension(content) {
  if (content.length >= 12 && content.toString('ascii', 0, 4) === 'RIFF' && content.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (content.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png';
  if (content.subarray(0, 3).toString('hex') === 'ffd8ff') return 'jpg';
  return '';
}
