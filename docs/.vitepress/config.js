https: module.exports = {
  title: "KVH",
  description: "Blockchain Cache: Key, Value, Height",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }]],
  themeConfig: {
    repo: "bn-kvh/kvh",
    logo: "/logo.svg",
    docsDir: "docs",
    docsBranch: "main",
    editLinks: true,
    editLinkText: "Suggest changes to this page",

    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      {
        text: "Links",
        items: [
          {
            text: "Discord Chat",
            link: "https://discord.gg/jUKyRxyedx",
          },
          {
            text: "DEV Community",
            link: "https://dev.to/t/kvh",
          },
          {
            text: "Github Discussions",
            link: "https://github.com/bn-kvh/kvh/discussions",
          },
          {
            text: "Changelog",
            link: "https://github.com/bn-kvh/kvh/blob/main/packages/kvh/CHANGELOG.md",
          },
        ],
      },
    ],

    sidebar: {
      "/guide": [
        {
          text: "Guide",
          children: [
            {
              text: "Getting Started",
              link: "/guide/",
            },
            {
              text: "Why kvh",
              link: "/guide/why",
            },
            {
              text: "Features",
              link: "/guide/features",
            },
          ],
        },
      ],
      "/api": [
        {
          text: "APIs",
          children: [
            {
              text: "Introduction",
              link: "/api/",
            },
          ],
        },
      ],
    },
  },
};
