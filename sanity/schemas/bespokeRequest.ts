import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bespokeRequest',
  title: 'Bespoke Request',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'gender', title: 'Gender', type: 'string' }),
    defineField({ name: 'birthday', title: 'Date of birth', type: 'string' }),
    defineField({ name: 'zodiac', title: 'Zodiac sign', type: 'string' }),
    defineField({ name: 'pieceType', title: 'Piece type', type: 'string' }),
    defineField({ name: 'wristSize', title: 'Wrist size (cm)', type: 'string' }),
    defineField({ name: 'ringSize', title: 'Ring size', type: 'string' }),
    defineField({
      name: 'colours',
      title: 'Preferred colours',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'styles',
      title: 'Preferred metal tone',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'note', title: 'Customer note', type: 'text', rows: 4 }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In consultation', value: 'consultation' },
          { title: 'Quoted', value: 'quoted' },
          { title: 'In production', value: 'production' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' }
        ]
      },
      initialValue: 'new'
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' })
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'name', subtitle: 'pieceType' }
  }
});
