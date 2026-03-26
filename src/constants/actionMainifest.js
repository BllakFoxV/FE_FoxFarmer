export const ACTION_TYPES = {
  CLICK_IMAGE: "CLICK_IMAGE",
  OCR: "OCR",
  IF_VAR: "IF_VAR",
  GOTO: "GOTO"
};

export const ACTION_MANIFEST = {
  [ACTION_TYPES.CLICK_IMAGE]: {
    label: "Click Image",
    fields: [
      { key: 'var_name', type: 'text', label: 'Save Result To' },
      { key: 'region', type: 'picker', label: 'Detection Area' },
      { key: 'threshold', type: 'number', label: 'Confidence', default: 0.8 },
      { key: 'template', type: 'hidden' } // Base64 crop
    ]
  },
  [ACTION_TYPES.IF_VAR]: {
    label: "If Condition",
    fields: [
      { key: 'var1', type: 'text', label: 'Variable Name' },
      { key: 'operator', type: 'select', options: ['==', '!=', '>', '<'] },
      { key: 'true_id', type: 'link', label: 'If True' },
      { key: 'false_id', type: 'link', label: 'If False' }
    ]
  }
};