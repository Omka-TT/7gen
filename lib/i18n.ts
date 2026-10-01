export const LANGS = ['ky', 'ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get('lang')?.value;
  return LANGS.includes(value as Lang) ? (value as Lang) : 'ru';
}

export function pick(item: Record<string, any> | null | undefined, field: string, lang: Lang): string {
  if (!item) return '';
  const order = [`${field}_${lang}`, `${field}_ru`, field, `${field}_en`, `${field}_ky`];
  for (const key of order) {
    const v = item[key];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

const ru = {
  nav: { home: 'Главная', map: 'Карта', why: 'Почему мы' },
  hero: {
    eyebrow: 'Путешествия по Кыргызстану',
    title: 'Откройте для себя страну небесных гор',
    subtitle: 'Выберите область на карте, найдите отели, кафе и места, которые стоит увидеть, и свяжитесь напрямую.',
    cta: 'Открыть карту',
  },
  map: {
    all: 'Все',
    learnMore: 'Узнать подробнее',
    close: 'Закрыть',
    reset: 'Вернуться к виду всей страны',
    freeOn: 'Включить свободное перемещение',
    freeOff: 'Выключить свободное перемещение',
    hint: 'Нажмите на область или на точку',
  },
  categories: {
    hotel: 'Отели',
    cafe: 'Кафе',
    attraction: 'Что посмотреть',
    guide: 'Гиды',
    campsite: 'Юрты и кемпинги',
  },
  destinations: {
    eyebrow: 'Куда поехать',
    title: 'Выберите направление',
    subtitle: 'Каждая область Кыргызстана предлагает свою атмосферу — от высокогорных озёр до древних караванных троп.',
    cta: 'Смотреть все области на карте',
  },
  featured: {
    eyebrow: 'Подборка',
    title: 'Популярные места',
  },
  stats: {
    regions: 'областей на карте',
    places: 'мест уже добавлено',
    languages: 'языка интерфейса',
    always: 'доступ к карте',
  },
  how: {
    eyebrow: 'Как это работает',
    title: 'Три простых шага',
    steps: [
      { title: 'Выберите область', text: 'Откройте карту и кликните на регион или сразу на понравившуюся точку.' },
      { title: 'Изучите место', text: 'Посмотрите фото, описание и цену — решите, подходит ли вам это место.' },
      { title: 'Свяжитесь напрямую', text: 'Оставьте заявку — мы передадим её хозяину места или гиду, без посредников.' },
    ],
  },
  why: {
    eyebrow: 'Наши преимущества',
    title: 'Почему стоит выбрать именно нас?',
    items: [
      { title: 'Всё на одной карте', text: 'Области, отели, кафе и достопримечательности — в одном месте, без десятков вкладок.' },
      { title: 'Прямой контакт', text: 'Вы общаетесь напрямую с хозяином места или гидом — без посредников и скрытых наценок.' },
      { title: 'Три языка', text: 'Сайт доступен на кыргызском, русском и английском языках.' },
      { title: 'Отобранные места', text: 'Мы добавляем на карту только те места, о которых можем рассказать по существу.' },
    ],
  },
  cta: {
    title: 'Готовы отправиться в путь?',
    subtitle: 'Откройте интерактивную карту и начните планировать своё путешествие по Кыргызстану прямо сейчас.',
    button: 'Открыть карту',
  },
  footer: {
    tagline: 'Помогаем путешествовать по Кыргызстану и находить лучшие места.',
    navTitle: 'Навигация',
    contactTitle: 'Контакты',
    rights: 'Все права защищены.',
  },
  region: { back: '← На карту', places: 'Места в этом регионе', empty: 'Пока здесь нет добавленных мест.', more: 'Подробнее' },
  place: {
    back: '← На карту',
    price: 'Цена',
    phone: 'Телефон',
    about: 'О месте',
    request: 'Оставить заявку',
    requestHint: 'Оставьте контакты — мы свяжем вас с владельцем места.',
  },
  form: {
    name: 'Ваше имя',
    contact: 'Телефон или Telegram',
    message: 'Комментарий (необязательно)',
    submit: 'Отправить заявку',
    sending: 'Отправка...',
    success: 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.',
    error: 'Что-то пошло не так, попробуйте ещё раз',
  },
};

type Dict = typeof ru;

const en: Dict = {
  nav: { home: 'Home', map: 'Map', why: 'Why us' },
  hero: {
    eyebrow: 'Travel Kyrgyzstan',
    title: 'Discover the land of celestial mountains',
    subtitle: 'Pick a region on the map, find hotels, cafés and places worth seeing, and contact providers directly.',
    cta: 'Open the map',
  },
  map: {
    all: 'All',
    learnMore: 'Learn more',
    close: 'Close',
    reset: 'Back to the whole country',
    freeOn: 'Enable free movement',
    freeOff: 'Disable free movement',
    hint: 'Click a region or a point',
  },
  categories: {
    hotel: 'Hotels',
    cafe: 'Cafés',
    attraction: 'Sights',
    guide: 'Guides',
    campsite: 'Yurts & camps',
  },
  destinations: {
    eyebrow: 'Where to go',
    title: 'Choose a destination',
    subtitle: 'Every region of Kyrgyzstan has its own character — from high-altitude lakes to ancient caravan trails.',
    cta: 'See all regions on the map',
  },
  featured: {
    eyebrow: 'Selection',
    title: 'Popular places',
  },
  stats: {
    regions: 'regions on the map',
    places: 'places added so far',
    languages: 'interface languages',
    always: 'map access',
  },
  how: {
    eyebrow: 'How it works',
    title: 'Three simple steps',
    steps: [
      { title: 'Pick a region', text: 'Open the map and click a region, or go straight to a point you like.' },
      { title: 'Explore a place', text: 'See photos, description and price — decide if it fits you.' },
      { title: 'Contact directly', text: 'Send a request — we pass it straight to the host or guide, no middlemen.' },
    ],
  },
  why: {
    eyebrow: 'Our advantages',
    title: 'Why choose us?',
    items: [
      { title: 'Everything on one map', text: 'Regions, hotels, cafés and sights in one place — no dozens of open tabs.' },
      { title: 'Direct contact', text: 'You talk straight to the host or guide — no middlemen and no hidden markups.' },
      { title: 'Three languages', text: 'The site is available in Kyrgyz, Russian and English.' },
      { title: 'Hand-picked places', text: 'We only add places we can genuinely tell you about.' },
    ],
  },
  cta: {
    title: 'Ready to hit the road?',
    subtitle: 'Open the interactive map and start planning your trip across Kyrgyzstan right now.',
    button: 'Open the map',
  },
  footer: {
    tagline: 'We help you travel around Kyrgyzstan and find the best places.',
    navTitle: 'Navigation',
    contactTitle: 'Contacts',
    rights: 'All rights reserved.',
  },
  region: { back: '← Back to map', places: 'Places in this region', empty: 'No places added here yet.', more: 'Details' },
  place: {
    back: '← Back to map',
    price: 'Price',
    phone: 'Phone',
    about: 'About this place',
    request: 'Send a request',
    requestHint: 'Leave your contacts — we will connect you with the owner.',
  },
  form: {
    name: 'Your name',
    contact: 'Phone or Telegram',
    message: 'Comment (optional)',
    submit: 'Send request',
    sending: 'Sending...',
    success: 'Request sent! We will contact you soon.',
    error: 'Something went wrong, please try again',
  },
};

const ky: Dict = {
  nav: { home: 'Башкы бет', map: 'Карта', why: 'Эмне үчүн биз' },
  hero: {
    eyebrow: 'Кыргызстан боюнча саякат',
    title: 'Асман тоолорунун өлкөсүн ачыңыз',
    subtitle: 'Картадан аймакты тандаңыз, мейманканаларды, кафелерди жана көрүнүктүү жерлерди табыңыз да, түздөн-түз байланышыңыз.',
    cta: 'Картаны ачуу',
  },
  map: {
    all: 'Баары',
    learnMore: 'Толук маалымат',
    close: 'Жабуу',
    reset: 'Бүт өлкөнүн көрүнүшүнө кайтуу',
    freeOn: 'Эркин жылдырууну иштетүү',
    freeOff: 'Эркин жылдырууну өчүрүү',
    hint: 'Аймакты же чекитти басыңыз',
  },
  categories: {
    hotel: 'Мейманканалар',
    cafe: 'Кафелер',
    attraction: 'Көрүнүктүү жерлер',
    guide: 'Гиддер',
    campsite: 'Боз үйлөр жана кемпингдер',
  },
  destinations: {
    eyebrow: 'Кайда барса болот',
    title: 'Багытты тандаңыз',
    subtitle: 'Кыргызстандын ар бир аймагы өзүнүн атмосферасына ээ — бийик тоолуу көлдөрдөн байыркы кербен жолдоруна чейин.',
    cta: 'Бардык аймактарды картадан көрүү',
  },
  featured: {
    eyebrow: 'Тандалма',
    title: 'Популярдуу жерлер',
  },
  stats: {
    regions: 'аймак картада',
    places: 'жер кошулду',
    languages: 'тилде интерфейс',
    always: 'картага жеткиликтүү',
  },
  how: {
    eyebrow: 'Бул кантип иштейт',
    title: 'Үч жөнөкөй кадам',
    steps: [
      { title: 'Аймакты тандаңыз', text: 'Картаны ачып, аймакты же жактырган чекитти басыңыз.' },
      { title: 'Жерди изилдеңиз', text: 'Сүрөттөрдү, сүрөттөмөнү жана баасын көрүп, бул жер сизге туура келеби чечиңиз.' },
      { title: 'Түздөн-түз байланышыңыз', text: 'Өтүнмө калтырыңыз — биз аны ортомчусуз жердин ээсине же гидге өткөрөбүз.' },
    ],
  },
  why: {
    eyebrow: 'Артыкчылыктарыбыз',
    title: 'Эмне үчүн дал бизди тандаш керек?',
    items: [
      { title: 'Баары бир картада', text: 'Аймактар, мейманканалар, кафелер жана көрүнүктүү жерлер — ондогон барактарсыз, бир жерде.' },
      { title: 'Түз байланыш', text: 'Жердин ээси же гид менен ортомчусуз жана жашыруун кошумча акысыз түздөн-түз сүйлөшөсүз.' },
      { title: 'Үч тилде', text: 'Сайт кыргыз, орус жана англис тилдеринде жеткиликтүү.' },
      { title: 'Тандалган жерлер', text: 'Картага биз жөнүндө толук маалымат бере ала турган жерлерди гана кошобуз.' },
    ],
  },
  cta: {
    title: 'Жолго чыгууга даярсызбы?',
    subtitle: 'Интерактивдүү картаны ачып, Кыргызстан боюнча саякатыңызды азыр эле пландай баштаңыз.',
    button: 'Картаны ачуу',
  },
  footer: {
    tagline: 'Кыргызстан боюнча саякаттоого жана мыкты жерлерди табууга жардам беребиз.',
    navTitle: 'Навигация',
    contactTitle: 'Байланыш',
    rights: 'Бардык укуктар корголгон.',
  },
  region: { back: '← Картага', places: 'Бул аймактагы жерлер', empty: 'Азырынча жерлер кошула элек.', more: 'Толук маалымат' },
  place: {
    back: '← Картага',
    price: 'Баасы',
    phone: 'Телефон',
    about: 'Жер жөнүндө',
    request: 'Өтүнмө калтыруу',
    requestHint: 'Байланыш маалыматыңызды калтырыңыз — биз сизди жердин ээси менен байланыштырабыз.',
  },
  form: {
    name: 'Атыңыз',
    contact: 'Телефон же Telegram',
    message: 'Комментарий (милдеттүү эмес)',
    submit: 'Өтүнмө жөнөтүү',
    sending: 'Жөнөтүлүүдө...',
    success: 'Өтүнмө жөнөтүлдү! Жакын арада сиз менен байланышабыз.',
    error: 'Ката кетти, кайра аракет кылыңыз',
  },
};

export const dict: Record<Lang, Dict> = { ru, en, ky };

