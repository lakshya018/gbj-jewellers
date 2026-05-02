export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Publicly readable
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.name) {
              return data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'shortDescription',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'type',
      type: 'select',
      options: ['Ring', 'Necklace', 'Bangle', 'Earrings', 'Bracelet', 'Pendant'],
    },
    {
      name: 'purity',
      type: 'select',
      options: ['14KT', '18KT', '22KT', '24KT', '950 Platinum'],
    },
    {
      name: 'weight',
      type: 'text',
    },
    {
      name: 'badge',
      type: 'text',
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sizes',
      type: 'array',
      fields: [
        {
          name: 'size',
          type: 'text',
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'reviews',
      type: 'number',
      defaultValue: 0,
    },
  ],
};
