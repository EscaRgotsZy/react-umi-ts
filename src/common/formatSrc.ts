import config from '@/config';

export default function formatSrc (src: any) {
  // exclude contains base64 or /static
  if (src && !src.includes(';base64') && !src.includes('/static/img')) {
    // if src is Array
    if (src instanceof Array) {
      src = src[0];
    }

    // if src contains commas, split the first
    src = src ? src.split(',')[0] : '';

    // if src does not contain ([http | https]://), splice pic server address
    if (!src.match(/(http)s?:\/\//)) {
      src = config.baseImgUrl + src;
    }
  }

  return src;
}
