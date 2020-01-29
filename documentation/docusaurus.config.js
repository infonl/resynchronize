module.exports = {
  title: 'Resynchronize docs',
  tagline: 'The guide to the tools for asynchronous behaviour on your state',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/logo.png',
  organizationName: 'info.nl', // Usually your GitHub org/user name.
  projectName: 'resynchronize', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Resynchronize',
      logo: {
        alt: 'Resynchronize Logo',
        src: 'img/logo.png'
      },
      links: [
        { to: 'docs/gettingstarted', label: 'Docs', position: 'left' },
        {
          href: 'https://github.com/infonl/resynchronize',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/gettingstarted'
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
