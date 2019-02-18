import {
  Node,
  Mark,
} from 'tiptap'
import {
  removeMark,
  updateMark,
} from 'tiptap-commands'


export default class TextColor extends Mark {
  get name () {
    return 'textcolor'
  }

  get schema () {
    return {
      attrs: {
        color: {
          default: '',
        },
      },
      parseDOM: [{
        tag: 'span',
        style: 'color',
        getAttrs: value => ({
          color: value.style.color,
        }),
      }],
      toDOM: node => {
        return ['span', { style: `color: ${node.attrs.color}` }, 0]
      },
    }
  }

  commands ({ type, schema }) {
    return attrs => {
      if (attrs.color)
        return updateMark(type, attrs)

      return removeMark(type)
    }
  }
}
