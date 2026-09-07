import type { Project } from "@/types/global.types";

export const myProjects: Project[] = [
  {
    id: "1",
    title: "Erk-ui",
    image: "/ui.png",
    link: "https://github.com/Erksery/erk-ui",
    description:
      "Библиотека готовых UI-компонентов для создания современных веб-интерфейсов. Проект объединяет переиспользуемые элементы интерфейса в единую систему, помогая быстрее создавать новые страницы и сохранять визуальную целостность приложения. Основное внимание уделено удобству использования компонентов, их гибкости и возможности адаптировать интерфейс под задачи конкретного проекта.",
    languages: [
      { id: "1", name: "TypeScript", ratio: 84.8 },
      { id: "2", name: "SCSS", ratio: 14.9 },
      { id: "3", name: "HTML", ratio: 0.3 },
    ],
    technologies: [
      { id: "1", name: "React" },
      { id: "2", name: "Vite" },
      { id: "3", name: "SASS" },
      { id: "4", name: "Floating-UI" },
    ],
  },
  {
    id: "2",
    title: "ArtTech Production",
    image: "/arttech.png",
    link: "https://github.com/Erksery/artTechUiTest",
    description:
      "Файловый менеджер для хранения, организации и управления файлами, созданный как альтернатива привычным облачным хранилищам вроде Google Drive и Яндекс Диска. Интерфейс позволяет удобно работать с папками и файлами, просматривать содержимое хранилища и быстро находить нужные данные. Проект сфокусирован на создании полноценного рабочего интерфейса с ощущением готового корпоративного продукта.",
    languages: [
      { id: "1", name: "TypeScript", ratio: 77.6 },
      { id: "2", name: "SCSS", ratio: 21.6 },
      { id: "3", name: "Others", ratio: 0.8 },
    ],
    technologies: [
      { id: "1", name: "React" },
      { id: "2", name: "Vite" },
      { id: "3", name: "SASS" },
      { id: "4", name: "motion" },
      { id: "5", name: "React-Query" },
      { id: "6", name: "dnd-kit" },
    ],
  },
  {
    id: "3",
    title: "React-chat",
    image: null,
    link: "https://github.com/Erksery/react-chat",
    description:
      "Современное веб-приложение для общения в реальном времени. Проект представляет собой полноценный интерфейс чата с диалогами, сообщениями и взаимодействием между пользователями. Основной акцент сделан на удобстве общения, динамическом обновлении интерфейса и создании привычного пользовательского опыта, характерного для современных мессенджеров.",
    languages: [
      { id: "1", name: "JavaScript", ratio: 75 },
      { id: "2", name: "SCSS", ratio: 23.6 },
      { id: "3", name: "HTML", ratio: 1.4 },
    ],
    technologies: [
      { id: "1", name: "React" },
      { id: "2", name: "Vite" },
      { id: "3", name: "SASS" },
      { id: "4", name: "Redux" },
      { id: "5", name: "motion" },
    ],
  },
  {
    id: "4",
    title: "CoffeShop",
    image: "coffe.png",
    link: "https://github.com/Erksery/CoffeeShop",
    description:
      "Мобильное приложение для кофейни, созданное как первый практический опыт разработки на React Native без использования дополнительного фреймворка. Приложение объединяет каталог кофейных напитков, информацию о товарах и основные сценарии взаимодействия с магазином. Проект стал практикой разработки мобильного интерфейса и работы с особенностями React Native на базовом уровне.",
    languages: [
      { id: "1", name: "JavaScript", ratio: 80.3 },
      { id: "2", name: "Java", ratio: 8.3 },
      { id: "3", name: "TypeScript", ratio: 5.2 },
    ],
    technologies: [
      { id: "1", name: "React Native" },
      { id: "2", name: "Firebase" },
      { id: "3", name: "Redux" },
    ],
  },
];
