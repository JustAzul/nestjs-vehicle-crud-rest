export enum ErrorCodes {
  DUPLICATE_VEHICLE = 'DUPLICATE_VEHICLE',
  INVALID_PAGE_OR_PAGE_SIZE = 'INVALID_PAGE_OR_PAGE_SIZE',
  PAGE_EXCEEDS_MAX = 'PAGE_EXCEEDS_MAX',
}

export const ERROR_MESSAGES: Record<keyof typeof ErrorCodes, Function> = {
  DUPLICATE_VEHICLE: (field: string) =>
    `Vehicle with the same ${field} already exists`,
  INVALID_PAGE_OR_PAGE_SIZE: () =>
    'Page and pageSize must be positive integers',
  PAGE_EXCEEDS_MAX: (page: number, maxPage: number) =>
    `Page ${page} exceeds maximum page number ${maxPage}`,
};
