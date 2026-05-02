export const Banners = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'cta',
      type: 'text',
      defaultValue: 'Shop Now',
    },
    {
      name: 'badge',
      type: 'text',
    },
    {
      name: 'bgColor',
      type: 'text',
      admin: {
        description: 'Tailwind CSS classes for background gradient (e.g. from-amber-950 to-yellow-900)',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Hex color code (e.g. #e6b84a)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Destination URL when CTA is clicked (e.g. /products?category=Gold)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
