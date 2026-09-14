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
    defineField({
      name: 'passwordHash',
      title: 'Password (hashed)',
      type: 'string',
      hidden: true,
      description: 'Never edit this manually — set only via the site\u2019s register/login flow.'
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'address', title: 'Usual address', type: 'text', rows: 2 }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'isMember',
      title: 'Joined the Siren Circle?',
      type: 'boolean',
      initialValue: false,
      description: 'False = this person has an account/login but has not joined membership yet. True = they filled in the Membership page form and are an active Siren Circle (or Private Client) member.'
    }),
    defineField({
      name: 'memberCode',
      title: 'Member code',
      type: 'string',
      description: 'Only set once the person actually joins the Siren Circle via the Membership page.'
    }),
    defineField({
      name: 'tier',
      title: 'Membership tier',
      type: 'string',
      options: { list: [{ title: 'Siren Circle', value: 'circle' }, { title: 'Private Client', value: 'private' }] }
    }),
    defineField({
      name: 'resetCode',
      title: 'Password reset code (temporary)',
      type: 'string',
      hidden: true
    }),
    defineField({
      name: 'resetCodeExpiresAt',
      title: 'Reset code expires at',
      type: 'datetime',
      hidden: true
    }),
    defineField({ name: 'joinedAt', title: 'Joined at', type: 'datetime' })
  ],
  preview: {
    select: { title: 'firstName', subtitle: 'memberCode' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Member', subtitle })
  }
});
