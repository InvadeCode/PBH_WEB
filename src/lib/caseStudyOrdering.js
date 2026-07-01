const MAX_ORDER = Number.MAX_SAFE_INTEGER;

const toKey = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const toOrderNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const slugifyClient = (client) =>
  (client || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const findReferenceCaseStudy = (item, referenceItems = []) => {
  const idKey = toKey(item?.id);
  const clientKey = toKey(item?.client);
  return referenceItems.find((reference) => {
    if (idKey && toKey(reference.id) === idKey) return true;
    return clientKey && toKey(reference.client) === clientKey;
  });
};

export const normalizeCaseStudyUrlId = (item, referenceItems = []) => {
  const explicitId = typeof item?.id === 'string' ? item.id.trim() : item?.id;
  if (explicitId) return explicitId;

  const reference = findReferenceCaseStudy(item, referenceItems);
  if (reference?.id) return reference.id;

  return slugifyClient(item?.client) || item?._id || item?.cmsId || '';
};

export const orderCaseStudies = (items = [], referenceItems = []) => {
  const referenceIndex = new Map();
  referenceItems.forEach((item, index) => {
    const idKey = toKey(item.id);
    const clientKey = toKey(item.client);
    if (idKey && !referenceIndex.has(`id:${idKey}`)) referenceIndex.set(`id:${idKey}`, index);
    if (clientKey && !referenceIndex.has(`client:${clientKey}`)) referenceIndex.set(`client:${clientKey}`, index);
  });

  const lookupReferenceIndex = (item) => {
    const idKey = toKey(item?.id);
    const clientKey = toKey(item?.client);
    if (idKey && referenceIndex.has(`id:${idKey}`)) return referenceIndex.get(`id:${idKey}`);
    if (clientKey && referenceIndex.has(`client:${clientKey}`)) return referenceIndex.get(`client:${clientKey}`);
    return MAX_ORDER;
  };

  return [...items]
    .map((item, sourceIndex) => {
      const workPageOrder = toOrderNumber(item.workPageOrder);
      const legacyOrder = toOrderNumber(item.order);
      const orderNumber = workPageOrder ?? legacyOrder;
      const rank = typeof item.orderRank === 'string' && item.orderRank.trim() ? item.orderRank.trim() : null;
      const staticIndex = lookupReferenceIndex(item);

      return {
        item,
        sourceIndex,
        orderNumber,
        rank,
        staticIndex,
      };
    })
    .sort((a, b) => {
      const aHasOrder = a.orderNumber !== null;
      const bHasOrder = b.orderNumber !== null;
      if (a.rank || b.rank) {
        if (a.rank && b.rank && a.rank !== b.rank) return a.rank.localeCompare(b.rank);
        if (a.rank !== b.rank) return a.rank ? -1 : 1;
      }

      if (aHasOrder || bHasOrder) {
        if (aHasOrder && bHasOrder && a.orderNumber !== b.orderNumber) {
          return a.orderNumber - b.orderNumber;
        }
        if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
      }

      if (a.staticIndex !== b.staticIndex) return a.staticIndex - b.staticIndex;
      return a.sourceIndex - b.sourceIndex;
    })
    .map(({ item }) => item);
};
