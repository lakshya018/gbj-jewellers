export const Orders = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'totalAmount', 'orderStatus', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    create: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'clerkUserId',
      type: 'text',
      index: true,
      admin: {
        description: 'Clerk User ID of the customer (empty for guest checkout)',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'size',
          type: 'text',
        },
        {
          name: 'priceAtPurchase',
          type: 'number',
          required: true,
          admin: {
            description: 'Price of a single unit at the time of purchase',
          },
        },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: ['razorpay', 'cod'],
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: ['pending', 'paid', 'failed'],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'orderStatus',
      type: 'select',
      options: ['processing', 'shipped', 'delivered', 'cancelled'],
      defaultValue: 'processing',
      required: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'text' },
        { name: 'line1', type: 'text', required: true },
        { name: 'line2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'pincode', type: 'text', required: true },
      ],
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          // Generate a simple order number like ORD-168392103
          data.orderNumber = `ORD-${Math.floor(Date.now() / 1000)}`;
        }
        return data;
      },
    ],
  },
};
