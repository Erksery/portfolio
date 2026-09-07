import {
  CodeXml,
  Component,
  Container,
  GitBranch,
  Globe,
  Paintbrush,
  Server,
} from "lucide-react";

import type { Stack } from "@/types/global.types";

import { ReactSvg } from "@/icons/ReactSvg";
import { CssSvg } from "@/icons/CssSvg";
import { HtmlSvg } from "@/icons/HtmlSvg";
import { JsSvg } from "@/icons/JsSvg";
import { TsSvg } from "@/icons/TsSvg";
import { NextSvg } from "@/icons/NextSvg";
import { AstroSvg } from "@/icons/AstroSvg";
import { SassSvg } from "@/icons/SassSvg";
import { ZusSvg } from "@/icons/ZusSvg";
import { ReduxSvg } from "@/icons/ReduxSvg";
import { NodeSvg } from "@/icons/NodeSvg";
import { TauriSvg } from "@/icons/TauriSvg";
import { ExpressSvg } from "@/icons/ExpressSvg";
import { NestSvg } from "@/icons/NestSvg";
import { MySqlSvg } from "@/icons/MySqlSvg";
import { PostgressSvg } from "@/icons/Postgress";
import { PrismaSvg } from "@/icons/PrismaSvg";
import { FigmaSvg } from "@/icons/FigmaSvg";
import { GitSvg } from "@/icons/GitSvg";
import { GithubSvg } from "@/icons/GithubSvg";
import { DockerSvg } from "@/icons/DockerSvg";
import { NginxSvg } from "@/icons/NginxSvg";

export const myStack: Stack[] = [
  {
    id: "frontend",
    title: "Frontend",
    icon: <CodeXml />,
    items: [
      {
        id: "react",
        title: "React",
        color: "#61DAFB",
        icon: <ReactSvg width={20} height={20} />,
        description:
          "Инструмент для создания современных интерактивных интерфейсов. Позволяет разбивать приложение на отдельные элементы и делать их удобными для повторного использования.",
      },
      {
        id: "react-native",
        title: "React Native",
        color: "#61DAFB",
        icon: <ReactSvg width={20} height={20} />,
        description:
          "Технология для создания мобильных приложений под iOS и Android. Позволяет разрабатывать приложения с единым подходом к интерфейсу и логике.",
      },
      {
        id: "next",
        title: "Next.js",
        color: "#FFFFFF",
        icon: <NextSvg width={20} height={20} />,
        description:
          "Платформа для создания быстрых и полноценных веб-приложений на React. Помогает улучшить скорость загрузки, структуру проекта и работу сайта с поисковыми системами.",
      },
      {
        id: "astro",
        title: "Astro",
        color: "#FF5D01",
        icon: <AstroSvg width={20} height={20} />,
        description:
          "Инструмент для создания быстрых и производительных сайтов. Позволяет отправлять пользователю только необходимый код, благодаря чему страницы загружаются быстрее.",
      },
      {
        id: "html",
        title: "HTML",
        color: "#E34F26",
        icon: <HtmlSvg width={20} height={20} />,
        description:
          "Основа любой веб-страницы, которая определяет её структуру и содержание. С его помощью задаются заголовки, текст, изображения, ссылки и другие элементы сайта.",
      },
      {
        id: "css",
        title: "CSS",
        color: "#1572B6",
        icon: <CssSvg width={20} height={20} />,
        description:
          "Отвечает за внешний вид веб-сайта и его элементов. Используется для создания дизайна, анимаций, расположения элементов и адаптации интерфейса под разные экраны.",
      },
      {
        id: "sass",
        title: "Sass",
        color: "#CC6699",
        icon: <SassSvg width={20} height={20} />,
        description:
          "Расширение возможностей CSS, которое помогает удобнее организовывать стили больших проектов. Делает работу с большим количеством визуальных правил более понятной и поддерживаемой.",
      },
      {
        id: "javascript",
        title: "JavaScript",
        color: "#F7DF1E",
        icon: <JsSvg width={20} height={20} />,
        description:
          "Язык программирования, который отвечает за интерактивность и поведение веб-сайтов. С его помощью интерфейс реагирует на действия пользователя и выполняет различную логику.",
      },
      {
        id: "typescript",
        title: "TypeScript",
        color: "#3178C6",
        icon: <TsSvg width={20} height={20} />,
        description:
          "Расширение JavaScript, которое помогает заранее находить ошибки и делать код более предсказуемым. Особенно полезен в больших проектах, где над кодом работает несколько разработчиков.",
      },
      {
        id: "zustand",
        title: "Zustand",
        color: "#C7A17A",
        icon: <ZusSvg width={20} height={20} />,
        description:
          "Инструмент для управления общими данными приложения. Позволяет удобно хранить информацию, которой должны пользоваться разные части интерфейса.",
      },
      {
        id: "redux",
        title: "Redux",
        color: "#764ABC",
        icon: <ReduxSvg width={20} height={20} />,
        description:
          "Инструмент для управления состоянием сложных приложений. Помогает централизованно хранить важные данные и контролировать изменения в интерфейсе.",
      },
      {
        id: "tauri",
        title: "Tauri",
        color: "#FFC131",
        icon: <TauriSvg width={20} height={20} />,
        description:
          "Технология для создания приложений, которые работают непосредственно на компьютере. Позволяет использовать веб-интерфейс внутри лёгких настольных приложений.",
      },
    ],
  },

  {
    id: "backend",
    title: "Backend",
    icon: <Server />,
    items: [
      {
        id: "node",
        title: "Node.js",
        color: "#339933",
        icon: <NodeSvg width={20} height={20} />,
        description:
          "Среда для создания серверной части приложений на JavaScript. Используется для обработки запросов, работы с данными, авторизации пользователей и другой серверной логики.",
      },
      {
        id: "rest-api",
        title: "REST API",
        color: "#8B8B8B",
        icon: <Globe width={20} height={20} />,
        description:
          "Способ обмена данными между приложением и сервером. Благодаря API интерфейс может получать и отправлять данные, например профили пользователей, товары или результаты действий.",
      },
      {
        id: "express",
        title: "Express.js",
        color: "#FFFFFF",
        icon: <ExpressSvg width={20} height={20} />,
        description:
          "Инструмент для создания серверной части и API на Node.js. Помогает обрабатывать запросы пользователей и организовывать логику веб-приложения.",
      },
      {
        id: "nestjs",
        title: "NestJS",
        color: "#E0234E",
        icon: <NestSvg width={20} height={20} />,
        description:
          "Платформа для создания структурированной и масштабируемой серверной части. Подходит для больших приложений, где важно разделять бизнес-логику, данные и отдельные функции системы.",
      },
      {
        id: "mysql",
        title: "MySQL",
        color: "#4479A1",
        icon: <MySqlSvg width={20} height={20} />,
        description:
          "Система для хранения и управления данными приложения. Используется, когда необходимо надёжно сохранять информацию о пользователях, заказах, товарах и других объектах.",
      },
      {
        id: "postgresql",
        title: "PostgreSQL",
        color: "#4169E1",
        icon: <PostgressSvg width={20} height={20} />,
        description:
          "Надёжная система хранения данных для веб-приложений. Подходит для проектов со сложной структурой данных и большим количеством взаимосвязей между ними.",
      },
      {
        id: "prisma",
        title: "Prisma",
        color: "#5A67D8",
        icon: <PrismaSvg width={20} height={20} />,
        description:
          "Инструмент, который упрощает работу приложения с базой данных. Помогает безопасно получать, изменять и создавать данные без необходимости постоянно писать сложные запросы вручную.",
      },
    ],
  },

  {
    id: "design",
    title: "UI/UX & Design",
    icon: <Paintbrush />,
    items: [
      {
        id: "figma",
        title: "Figma",
        color: "#F24E1E",
        icon: <FigmaSvg width={20} height={20} />,
        description:
          "Инструмент для проектирования интерфейсов и создания визуальных макетов. Используется для продумывания внешнего вида сайта или приложения до начала разработки.",
      },
      {
        id: "ui-systems",
        title: "UI Systems",
        color: "#A0A0A0",
        icon: <Component width={20} height={20} />,
        description:
          "Система общих визуальных элементов и правил для интерфейса. Помогает сохранять единый стиль продукта и ускоряет создание новых страниц и функций.",
      },
    ],
  },

  {
    id: "version-control",
    title: "Version Control",
    icon: <GitBranch />,
    items: [
      {
        id: "git",
        title: "Git",
        color: "#F05032",
        icon: <GitSvg width={20} height={20} />,
        description:
          "Инструмент для сохранения истории изменений в проекте. Позволяет безопасно работать над кодом, возвращаться к предыдущим версиям и объединять работу нескольких разработчиков.",
      },
      {
        id: "github",
        title: "GitHub",
        color: "#FFFFFF",
        icon: <GithubSvg width={20} height={20} />,
        description:
          "Онлайн-платформа для хранения проектов и совместной работы над ними. Используется для управления исходным кодом, задачами и процессом разработки.",
      },
    ],
  },

  {
    id: "devops",
    title: "DevOps",
    icon: <Container />,
    items: [
      {
        id: "docker",
        title: "Docker",
        color: "#2496ED",
        icon: <DockerSvg width={20} height={20} />,
        description:
          "Инструмент для запуска приложения в изолированной среде. Помогает сделать запуск проекта одинаковым на компьютере разработчика, сервере и других системах.",
      },
      {
        id: "nginx",
        title: "Nginx",
        color: "#009639",
        icon: <NginxSvg width={20} height={20} />,
        description:
          "Программа, которая помогает доставлять сайт пользователям и обрабатывать входящие запросы. Также используется для настройки доменов, HTTPS и распределения нагрузки.",
      },
    ],
  },
];
