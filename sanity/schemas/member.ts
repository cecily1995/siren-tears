import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'member',
  title: 'Siren Circle Member',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', title: 'First name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last name', type: 'string' }),
    defineField({ name: 'birthday', title: 'Date of birth', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address', title: 'Usual address', type: 'text', rows: 2 }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'memberCode',
      title: 'Member code',
      type: 'string',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'tier',
      title: 'Membership tier',
      type: 'string',
      options: { list: [{ title: 'Siren Circle', value: 'circle' }, { title: 'Private Client', value: 'private' }] },
      initialValue: 'circle'
    }),
    defineField({ name: 'joinedAt', title: 'Joined at', type: 'datetime' })
  ],
  preview: {
    select: { title: 'firstName', subtitle: 'memberCode' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Member', subtitle })
  }
});
