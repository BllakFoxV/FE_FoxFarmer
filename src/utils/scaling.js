export const getScaleFactor = (naturalH, clientH) => naturalH / clientH;

export const convertToRaw = (uiCoord, scale) => Math.round(uiCoord * scale);