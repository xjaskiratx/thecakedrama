import React, { useEffect, useMemo, useRef, useState } from 'react'

const SUBTITLE = 'FROM OUR OVEN, TO YOUR HEART';
const INSTAGRAM_PLACEHOLDER = 'xjaskiratx';

function formatPriceValue(value) {
  return `Rs. ${value}`;
}

function formatProductPrice(product) {
  if (!product.priceOptions?.length) return '';
  if (product.priceOptions.length === 1) return formatPriceValue(product.priceOptions[0].price);
  return product.priceOptions.map((opt) => opt.price).map(formatPriceValue).join(' / ');
}

function BagIcon({ size = 22, stroke = '#98457D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}

function PlusIcon({ size = 18, stroke = '#98457D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14"></path>
      <path d="M5 12h14"></path>
    </svg>
  );
}

function BagPlus({ stroke = '#98457D' }) {
  return (
    <span className="bag-plus" aria-hidden="true">
      <BagIcon size={22} stroke={stroke} />
      <PlusIcon size={18} stroke={stroke} />
    </span>
  );
}

const MENU = [
  // Cheesecakes (two prices: regular/large)
  { id: 1, name: 'NY-style Baked', category: 'Cheesecakes', image: '/ny_baked_cheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 800 }, { id: 'large', label: 'Large', price: 1400 }] },
  { id: 2, name: 'Chocolate Mousse', category: 'Cheesecakes', image: '/item-800.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 1000 }, { id: 'large', label: 'Large', price: 1500 }] },
  { id: 3, name: 'Blueberry', category: 'Cheesecakes', image: '/item-800.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 900 }, { id: 'large', label: 'Large', price: 1600 }] },
  { id: 4, name: 'Strawberry', category: 'Cheesecakes', image: '/StrawberryCheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 900 }, { id: 'large', label: 'Large', price: 1500 }] },
  { id: 5, name: 'Lotus Biscoff', category: 'Cheesecakes', image: '/lotus_biscoff_cheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 1300 }, { id: 'large', label: 'Large', price: 2000 }] },
  { id: 6, name: 'Nutella', category: 'Cheesecakes', image: '/NutellaBrownieCake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 1200 }, { id: 'large', label: 'Large', price: 2000 }] },
  { id: 7, name: "Cookies n' cream", category: 'Cheesecakes', image: '/item-800.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 800 }, { id: 'large', label: 'Large', price: 1400 }] },
  { id: 8, name: 'Red Velvet', category: 'Cheesecakes', image: '/red_velvet_cheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 1000 }, { id: 'large', label: 'Large', price: 1600 }] },
  { id: 9, name: 'Mango', category: 'Cheesecakes', image: '/MangoCheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 900 }, { id: 'large', label: 'Large', price: 1500 }] },
  { id: 10, name: 'Trio cheesecake', category: 'Cheesecakes', image: '/TrioCheesecake.webp', priceOptions: [{ id: 'regular', label: 'Regular', price: 1000 }, { id: 'large', label: 'Large', price: 1700 }] },

  // Tea time cakes (half/full; flavours can be customized; can be wholewheat)
  { id: 11, name: 'Banana Walnut', category: 'Tea time cakes', image: '/BananaWalnut.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 700 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 12, name: 'Healthy oats Cake', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 700 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 13, name: 'Mango crumbled Cake', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 800 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 14, name: 'Lemon loaf Cake', category: 'Tea time cakes', image: '/lemon_loaf_cake.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 550 }, { id: 'full', label: 'Full (750-800g)', price: 800 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 15, name: 'Bundt-Coconut Cake', category: 'Tea time cakes', image: '/CreamyCoconut.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 750 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 16, name: 'Orange-glaze Cake', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 700 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 17, name: 'Pineapple upside-down', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 700 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 18, name: 'Spiced-plum Cake', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 750 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 19, name: 'Apple oat-wheat Cake', category: 'Tea time cakes', image: '/AppleOat.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 750 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 20, name: "Fruit n' nut Cake", category: 'Tea time cakes', image: '/MixedFruitCake.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 750 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 21, name: 'Roasted Almond', category: 'Tea time cakes', image: '/item-800.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 800 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 22, name: 'Marble Cake', category: 'Tea time cakes', image: '/marble_cake.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 500 }, { id: 'full', label: 'Full (750-800g)', price: 700 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },
  { id: 23, name: 'Mud Cake', category: 'Tea time cakes', image: '/mud_cake.webp', priceOptions: [{ id: 'half', label: 'Half (450-500g)', price: 600 }, { id: 'full', label: 'Full (750-800g)', price: 900 }], flourOptions: [{ id: 'regular', label: 'Regular' }, { id: 'wholewheat', label: 'Wholewheat' }], allowCustomizationNote: true, customizationPlaceholder: 'Wholewheat? Flavour preference? Any customization? Write it here…' },

  // Brownies (500g/1kg or single)
  { id: 24, name: 'OG Nutella Fudge Brownie', category: 'Brownies', image: '/FudgeBrownies.webp', priceOptions: [{ id: '500g', label: '500g', price: 500 }, { id: '1kg', label: '1kg', price: 800 }] },
  { id: 25, name: 'Biscoff Brownie', category: 'Brownies', image: '/item-800.webp', priceOptions: [{ id: '500g', label: '500g', price: 500 }, { id: '1kg', label: '1kg', price: 900 }] },
  { id: 26, name: 'Assorted Brownie box', category: 'Brownies', image: '/AssortedBrownies.webp', priceOptions: [{ id: 'box', label: 'Box', price: 600 }] },
  { id: 27, name: 'Crinkled Brownie', category: 'Brownies', image: '/item-800.webp', priceOptions: [{ id: '500g', label: '500g', price: 500 }, { id: '1kg', label: '1kg', price: 800 }] },
  { id: 28, name: 'Wholewheat Brownie', category: 'Brownies', image: '/item-800.webp', priceOptions: [{ id: '500g', label: '500g', price: 450 }, { id: '1kg', label: '1kg', price: 700 }] },
  { id: 29, name: 'Triple Chocolate Brownie', category: 'Brownies', image: '/triple_chocolate_brownie.webp', priceOptions: [{ id: '500g', label: '500g', price: 500 }] },
  { id: 30, name: 'Brownie Bites', category: 'Brownies', image: '/NutellaBrownieBites.webp', priceOptions: [{ id: 'single', label: 'Pack', price: 280 }], flavourOptions: [{ id: 'nutella', label: 'Nutella' }, { id: 'biscoff', label: 'Biscoff' }, { id: 'dark', label: 'Dark chocolate' }, { id: 'white', label: 'White chocolate' }], optionsLabel: 'Toppings (optional)', optionsRequired: false, allowCustomizationNote: true, customizationPlaceholder: 'Anything else? (extra toppings, packing note, etc.)' },
  { id: 31, name: 'Brownie w/ Almonds', category: 'Brownies', image: '/BrownieWithAlmonds.webp', priceOptions: [{ id: '500g', label: '500g', price: 500 }, { id: '1kg', label: '1kg', price: 800 }] },

  // Cookies
  { id: 32, name: 'Choco Chip Cookies', category: 'Cookies', image: '/ChocoChipCookies.webp', priceOptions: [{ id: 'pack', label: 'Pack of 6', price: 350 }] },
  { id: 33, name: 'Granola Cookies', category: 'Cookies', image: '/GranolaCookies.webp', priceOptions: [{ id: 'pack', label: 'Pack of 6', price: 350 }] },
];

const FILTERS = ['All', 'Cheesecakes', 'Tea time cakes', 'Brownies', 'Cookies'];

function App() {
  const [activeFilter, setActiveFilter] = useState(null); // Instant UI updates
  const [displayFilter, setDisplayFilter] = useState(null); // Delayed grid updates
  const [searchTerm, setSearchTerm] = useState('');
  const [gridFadeState, setGridFadeState] = useState('');
  const gridFadeTimerRef = useRef(null);

  const [view, setView] = useState('grid'); // 'grid' | 'detail' | 'checkout'
  const [pageAnim, setPageAnim] = useState({ grid: '', detail: '', checkout: '' });
  const pageAnimTimerRef = useRef(null);
  const transitionToRef = useRef(null);
  const [activeProductId, setActiveProductId] = useState(null);
  const [selectedPriceId, setSelectedPriceId] = useState(null);
  const [selectedFlavourIds, setSelectedFlavourIds] = useState([]);
  const [selectedFlourId, setSelectedFlourId] = useState('regular');
  const [customizationNote, setCustomizationNote] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const [removeConfirmKey, setRemoveConfirmKey] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef(null);

  const [headerCookies, setHeaderCookies] = useState([
    { id: 1, left: '1%', top: '-7%', width: '22px', height: '22px', transform: 'rotate(15deg)' },
    { id: 2, left: '8%', top: '30%', width: '22px', height: '22px', transform: 'rotate(40deg)' },
    { id: 3, left: '1%', top: '120%', width: '22px', height: '22px', transform: 'rotate(-10deg)' },
    { id: 4, left: '87%', top: '30%', width: '22px', height: '22px', transform: 'rotate(-40deg)' },
    { id: 5, left: '94%', top: '120%', width: '22px', height: '22px', transform: 'rotate(10deg)' },
    { id: 6, left: '1%', top: '60%', width: '22px', height: '22px', transform: 'rotate(90deg)' },
    { id: 7, left: '94%', top: '60%', width: '22px', height: '22px', transform: 'rotate(-90deg)' },
    { id: 8, left: '8%', top: '95%', width: '22px', height: '22px', transform: 'rotate(200deg)' },
    { id: 9, left: '87%', top: '95%', width: '22px', height: '22px', transform: 'rotate(160deg)' },
    { id: 10, left: '94%', top: '-7%', width: '22px', height: '22px', transform: 'rotate(-15deg)' }
  ]);

  function handleHeaderClick(e) {
    if (view !== 'grid') return;

    // Actually just use the same logic as before for placement
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;

    const newCookie = {
      id: Date.now(),
      left: `${newX}%`,
      top: `${newY}%`,
      width: '24px', 
      height: '24px',
      transform: `rotate(${(headerCookies.length * 45) % 360}deg)`
    };

    setHeaderCookies(prev => [...prev, newCookie]);
  }

  const [draggingId, setDraggingId] = useState(null);
  const dragRafRef = useRef(null);

  function onCookiePointerDown(e, id) {
    e.stopPropagation();
    setDraggingId(id);
  }

  function onHeaderPointerMove(e) {
    if (draggingId === null) return;

    // Capture coordinates to avoid event pooling issues in rAF
    const clientX = e.clientX;
    const clientY = e.clientY;
    const currentTarget = e.currentTarget;

    if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    dragRafRef.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const xPct = ((clientX - rect.left) / rect.width) * 100;
      const yPct = ((clientY - rect.top) / rect.height) * 100;

      setHeaderCookies(prev => prev.map(c => 
        c.id === draggingId 
          ? { ...c, left: `${xPct}%`, top: `${yPct}%`, transition: 'none' } 
          : c
      ));
      dragRafRef.current = null;
    });
  }

  function onHeaderPointerUp() {
    if (draggingId !== null) {
      // Put transition back
      setHeaderCookies(prev => prev.map(c =>
        c.id === draggingId ? { ...c, transition: '' } : c
      ));
      setDraggingId(null);
    }
  }

  const activeProduct = useMemo(() => MENU.find((p) => p.id === activeProductId) || null, [activeProductId]);

  const filteredProducts = useMemo(() => {
    return MENU.filter((product) => {
      const matchesFilter = !displayFilter || product.category === displayFilter;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [displayFilter, searchTerm]);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems]);

  function showToast(message) {
    setToastMessage(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMessage(''), 2200);
  }

  function transitionTo(next) {
    if (!next?.page) return;
    if (pageAnimTimerRef.current) window.clearTimeout(pageAnimTimerRef.current);

    const nextPage = next.page;
    if (nextPage === view) return;

    const fromPage = view;
    setPageAnim((prev) => ({ ...prev, [fromPage]: 'exit' }));
    pageAnimTimerRef.current = window.setTimeout(() => {
      if (nextPage === 'detail') {
        setActiveProductId(next.productId ?? null);
        setSelectedPriceId(null);
        setSelectedFlavourIds([]);
        setSelectedFlourId('regular');
        setCustomizationNote('');
      } else {
        setActiveProductId(null);
      }

      setView(nextPage);
      setPageAnim((prev) => ({ ...prev, [fromPage]: '', [nextPage]: 'enter' }));

      pageAnimTimerRef.current = window.setTimeout(() => {
        setPageAnim((prev) => ({ ...prev, [nextPage]: '' }));
      }, 220); // Sync this with CSS transition duration
    }, 180); // Ensure this matches `pageOut` duration
  }
  useEffect(() => {
    transitionToRef.current = transitionTo;
  });

  function beginGridFadeThen(fn) {
    if (gridFadeTimerRef.current) window.clearTimeout(gridFadeTimerRef.current);
    setGridFadeState('fade-out');
    gridFadeTimerRef.current = window.setTimeout(() => {
      fn();
      setGridFadeState('fade-in');
      gridFadeTimerRef.current = window.setTimeout(() => setGridFadeState(''), 160);
    }, 140);
  }

  function onFilterClick(nextFilter) {
    if (nextFilter === activeFilter) return;
    setActiveFilter(nextFilter); // Instant visual feedback
    beginGridFadeThen(() => setDisplayFilter(nextFilter)); // Delayed grid update
  }

  function openProduct(product, { prompt } = {}) {
    if (prompt) showToast(prompt);

    // Simple navigation: treat detail as a separate "page" in history.
    window.history.pushState({ page: 'detail', productId: product.id }, '', '#product');
    transitionTo({ page: 'detail', productId: product.id });
  }

  function closeProduct() {
    // Prefer browser-style back navigation (popstate drives the transition).
    if (window.history.state?.page === 'detail') {
      window.history.back();
      return;
    }
    transitionTo({ page: 'grid' });
    window.history.replaceState({ page: 'grid' }, '', '#');
  }

  function openCheckout() {
    window.history.pushState({ page: 'checkout' }, '', '#checkout');
    transitionTo({ page: 'checkout' });
  }

  function closeCheckout() {
    if (window.history.state?.page === 'checkout') {
      window.history.back();
      return;
    }
    transitionTo({ page: 'grid' });
    window.history.replaceState({ page: 'grid' }, '', '#');
  }

  function lineItemKey({ productId, priceId, flavourIds, flourId, note }) {
    const normalizedFlavours = Array.isArray(flavourIds) ? [...flavourIds].sort().join(',') : '';
    const normalizedNote = (note || '').trim().replace(/\s+/g, ' ');
    return [productId, priceId || '', flourId || '', normalizedFlavours, normalizedNote].join('|');
  }

  function addToBag({ product, priceId, flavourIds, flourId, note }) {
    const chosenPrice = product.priceOptions.find((p) => p.id === priceId) || null;
    setCartItems((prev) => {
      const next = [...prev];
      const key = lineItemKey({ productId: product.id, priceId, flavourIds, flourId, note });
      const existingIndex = next.findIndex((x) => x.key === key);
      if (existingIndex >= 0) {
        next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + 1 };
        return next;
      }
      next.push({
        key,
        qty: 1,
        productId: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        priceId,
        priceLabel: chosenPrice?.label || '',
        priceValue: chosenPrice?.price || null,
        flavourIds: flavourIds || [],
        flourId: flourId || null,
        note: note || '',
      });
      return next;
    });
    showToast('Added to bag');
  }

  function onCardAddClick(e, product) {
    e.preventDefault();
    e.stopPropagation();

    const needsPriceChoice = product.priceOptions.length > 1;
    const hasOptions = !!product.flavourOptions?.length;

    // If there are any options (even optional), open details so user can pick them.
    if (!needsPriceChoice && !hasOptions) {
      addToBag({ product, priceId: product.priceOptions[0].id });
      return;
    }

    openProduct(product, {
      prompt: needsPriceChoice ? 'Choose a price option to add this.' : (product.optionsRequired ? 'Choose at least one option to add this.' : 'Optional: pick toppings/options, then add.'),
    });
  }

  function toggleChoice(list, id) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  const detailCanAdd = useMemo(() => {
    if (!activeProduct) return false;
    if (!selectedPriceId) return false;
    if (activeProduct.flavourOptions?.length && activeProduct.optionsRequired && selectedFlavourIds.length === 0) return false;
    if (activeProduct.flavourOptions?.length && selectedFlavourIds.includes('custom') && customizationNote.trim() === '') return false;
    return true;
  }, [activeProduct, customizationNote, selectedFlavourIds, selectedPriceId]);

  function onDetailAdd() {
    if (!activeProduct) return;
    if (!selectedPriceId) {
      showToast('Pick a price option first.');
      return;
    }
    if (activeProduct.flavourOptions?.length && activeProduct.optionsRequired && selectedFlavourIds.length === 0) {
      showToast('Pick at least one option first.');
      return;
    }
    if (activeProduct.flavourOptions?.length && selectedFlavourIds.includes('custom') && customizationNote.trim() === '') {
      showToast('Tell us your custom flavour in the note.');
      return;
    }

    addToBag({
      product: activeProduct,
      priceId: selectedPriceId,
      flavourIds: selectedFlavourIds,
      flourId: activeProduct.flourOptions?.length ? selectedFlourId : null,
      note: activeProduct.allowCustomizationNote ? customizationNote : '',
    });
  }

  function incrementQty(key) {
    setCartItems((prev) => prev.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)));
  }

  function decrementQty(key) {
    const item = cartItems.find((x) => x.key === key);
    if (!item) return;
    if (item.qty <= 1) {
      setRemoveConfirmKey(key);
      return;
    }
    setCartItems((prev) => prev.map((x) => (x.key === key ? { ...x, qty: x.qty - 1 } : x)));
  }

  function removeItem(key) {
    setCartItems((prev) => prev.filter((x) => x.key !== key));
    setRemoveConfirmKey(null);
    showToast('Removed from bag');
  }

  function buildOrderMessage(items) {
    const lines = [];
    lines.push('Hi! I would like to place an order:');
    lines.push('');
    items.forEach((item, idx) => {
      const parts = [];
      parts.push(`${idx + 1}. ${item.name} x${item.qty}`);
      if (item.priceLabel || item.priceValue != null) parts.push(`Price: ${item.priceLabel ? item.priceLabel + ' - ' : ''}${item.priceValue != null ? formatPriceValue(item.priceValue) : ''}`.trim());
      if (item.flourId) parts.push(`Flour: ${item.flourId === 'wholewheat' ? 'Wholewheat' : 'Regular'}`);
      if (item.flavourIds?.length) parts.push(`Options: ${item.flavourIds.join(', ')}`);
      if (item.note?.trim()) parts.push(`Note: ${item.note.trim()}`);
      lines.push(parts.join(' | '));
    });
    lines.push('');
    lines.push(`Total items: ${items.reduce((sum, x) => sum + x.qty, 0)}`);
    return lines.join('\n');
  }

  async function sendOrder() {
    if (!cartItems.length) {
      showToast('Your bag is empty.');
      return;
    }
    const message = buildOrderMessage(cartItems);
    try {
      await navigator.clipboard.writeText(message);
      showToast('Order copied. Paste it on Instagram DM.');
    } catch {
      showToast('Copy failed. Select and copy manually.');
    }
    window.open(`https://www.instagram.com/${INSTAGRAM_PLACEHOLDER}/`, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    // Initialize navigation state and support browser back/forward.
    if (!window.history.state?.page) {
      window.history.replaceState({ page: 'grid' }, '', '#');
    }

    function onPopState(e) {
      const page = e.state?.page || 'grid';
      if (page === 'detail') {
        transitionToRef.current?.({ page: 'detail', productId: e.state?.productId });
        return;
      }
      if (page === 'checkout') {
        transitionToRef.current?.({ page: 'checkout' });
        return;
      }
      transitionToRef.current?.({ page: 'grid' });
    }

    window.addEventListener('popstate', onPopState);
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (gridFadeTimerRef.current) window.clearTimeout(gridFadeTimerRef.current);
      if (pageAnimTimerRef.current) window.clearTimeout(pageAnimTimerRef.current);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="bg-pattern">
        {/* Floating cookies logic removed as per latest request, now in header */}
      </div>

      {view === 'grid' ? (
        <div className={`page ${pageAnim.grid}`}>
          <div className="sticky-header">
            <header
              onClick={handleHeaderClick}
              onPointerMove={onHeaderPointerMove}
              onPointerUp={onHeaderPointerUp}
              onPointerLeave={onHeaderPointerUp}
              style={{ cursor: draggingId ? 'grabbing' : 'crosshair' }}
              title="Click to place, drag to move"
            >
              <div className="header-cookies-container">
                {headerCookies.map(cookie => (
                  <div
                    key={cookie.id}
                    className="header-cookie"
                    onPointerDown={(e) => onCookiePointerDown(e, cookie.id)}
                    style={{
                      left: cookie.left,
                      top: cookie.top,
                      width: cookie.width,
                      height: cookie.height,
                      transform: cookie.transform,
                      transition: cookie.transition,
                      cursor: draggingId === cookie.id ? 'grabbing' : 'grab',
                      touchAction: 'none'
                    }}
                  />
                ))}
              </div>
              <h1 className="title">the cake drama</h1>
              <p className="subtitle uppercase">{SUBTITLE}</p>
            </header>

            <section className="search-section">
              <div className="search-bar-container">
                <div className="search-bar">
                  <span className="search-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button type="button" className="bag-icon" aria-label="Shopping bag" onClick={openCheckout}>
                  <BagIcon size={24} stroke="#98457D" />
                  {cartCount > 0 ? <span className="bag-badge" aria-label={`${cartCount} items`}>{cartCount}</span> : null}
                </button>
              </div>
            </section>

            <section className="filter-section">
              <div className="filter-status">
                <div className="filter-status-text">
                  <span>Showing: </span>
                  <span className="filter-status-text-anim inline-anim" key={activeFilter || 'all'}>
                    {activeFilter ? activeFilter : 'All products'}
                  </span>
                </div>
                <button type="button" className={`clear-filter-btn ${activeFilter ? '' : 'is-hidden'}`} onClick={() => onFilterClick(null)} aria-label="Clear filter" disabled={!activeFilter}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="filters">
                {FILTERS.filter((x) => x !== 'All').map(filter => (
                  <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => onFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <main className={`product-grid-scroll ${gridFadeState}`} aria-label="Products">
            <div className="product-grid">
              {filteredProducts.map(product => (
                <article key={product.id} className="product-card" role="button" tabIndex={0} onClick={() => openProduct(product)} onKeyDown={(e) => (e.key === 'Enter' ? openProduct(product) : null)}>
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      srcSet={product.image === '/item-800.webp' ? '/item-400.webp 400w, /item-800.webp 800w' : undefined}
                      sizes="(max-width: 480px) 45vw, 400px"
                      alt={product.name}
                      loading="lazy"
                    />
                    <button type="button" className="card-action" onClick={(e) => onCardAddClick(e, product)} aria-label="Add to bag">
                      <BagPlus />
                    </button>
                  </div>
                  <div className="product-info-bar">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{formatProductPrice(product)}</p>
                  </div>
                </article>
              ))}
            </div>
          </main>
        </div>
      ) : null}

      {view === 'detail' && activeProduct ? (
        <main className={`page detail-page ${pageAnim.detail}`} aria-label="Product details">
          <div className="detail-top">
            <p className="detail-subtitle uppercase">{SUBTITLE}</p>
            <button type="button" className="back-btn" onClick={closeProduct} aria-label="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
          </div>

          <div className="detail-scroll">
            <div className="detail-image">
              <img
                src={activeProduct.image}
                srcSet={activeProduct.image === '/item-800.webp' ? '/item-400.webp 400w, /item-800.webp 800w' : undefined}
                sizes="(max-width: 480px) 90vw, 800px"
                alt={activeProduct.name}
              />
            </div>

            <div className="detail-content">
              <h2 className="detail-title">{activeProduct.name}</h2>

              <div className="detail-section">
                <p className="detail-label">Price</p>
                <div className="choice-chips">
                  {activeProduct.priceOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`choice-chip ${selectedPriceId === opt.id ? 'active' : ''}`}
                      onClick={() => setSelectedPriceId(opt.id)}
                    >
                      <span className="chip-title">{opt.label}</span>
                      <span className="chip-sub">{formatPriceValue(opt.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeProduct.flavourOptions?.length ? (
                <div className="detail-section">
                  <p className="detail-label">{activeProduct.optionsLabel || 'Options'}</p>
                  <div className="choice-chips">
                    {activeProduct.flavourOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`choice-chip ${selectedFlavourIds.includes(opt.id) ? 'active' : ''}`}
                        onClick={() => setSelectedFlavourIds((prev) => toggleChoice(prev, opt.id))}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {activeProduct.optionsRequired ? <p className="detail-hint">Pick at least one.</p> : <p className="detail-hint">Optional.</p>}
                </div>
              ) : null}

              {activeProduct.flourOptions?.length ? (
                <div className="detail-section">
                  <p className="detail-label">Flour</p>
                  <div className="choice-chips">
                    {activeProduct.flourOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`choice-chip ${selectedFlourId === opt.id ? 'active' : ''}`}
                        onClick={() => setSelectedFlourId(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeProduct.allowCustomizationNote ? (
                <div className="detail-section">
                  <p className="detail-label">Customization</p>
                  <textarea
                    className="custom-note"
                    rows={3}
                    placeholder={activeProduct.customizationPlaceholder || 'Write a note…'}
                    value={customizationNote}
                    onChange={(e) => setCustomizationNote(e.target.value)}
                  />
                </div>
              ) : null}

              <button type="button" className={`add-btn ${detailCanAdd ? '' : 'disabled'}`} onClick={onDetailAdd} disabled={!detailCanAdd} aria-disabled={!detailCanAdd}>
                <BagPlus />
                <span>Add to bag</span>
              </button>
              {!detailCanAdd ? <p className="detail-hint">Choose a price{activeProduct.flavourOptions?.length && activeProduct.optionsRequired ? ' (and at least one option)' : ''} to add.</p> : null}
            </div>
          </div>
        </main>
      ) : null}

      {view === 'checkout' ? (
        <main className={`page checkout-page ${pageAnim.checkout}`} aria-label="Checkout">
          <div className="detail-top checkout-top">
            <p className="detail-subtitle uppercase">{SUBTITLE}</p>
            <button type="button" className="back-btn" onClick={closeCheckout} aria-label="Back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
          </div>

          <div className="detail-scroll">
            <div className="detail-content">
              <h2 className="detail-title">Your bag</h2>

              {cartItems.length === 0 ? (
                <p className="detail-hint">Nothing added yet.</p>
              ) : (
                <div className="checkout-list">
                  {cartItems.map((item) => (
                    <div key={item.key} className="checkout-item">
                      <div className="checkout-info">
                        <div className="checkout-name">{item.name}</div>
                        <div className="checkout-meta">
                          {item.priceLabel || item.priceValue != null ? (
                            <span className="meta-chip">{item.priceLabel ? `${item.priceLabel}` : 'Price'}{item.priceValue != null ? ` · ${formatPriceValue(item.priceValue)}` : ''}</span>
                          ) : null}
                          {item.flourId ? <span className="meta-chip">{item.flourId === 'wholewheat' ? 'Wholewheat' : 'Regular'}</span> : null}
                          {item.flavourIds?.length ? <span className="meta-chip">{item.flavourIds.join(', ')}</span> : null}
                        </div>
                        {item.note?.trim() ? <div className="checkout-note">{item.note.trim()}</div> : null}
                      </div>
                      <div className="qty-controls" aria-label="Quantity controls">
                        <button type="button" className="qty-btn" onClick={() => decrementQty(item.key)} aria-label="Decrease quantity">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14"></path>
                          </svg>
                        </button>
                        <div className="qty-value" aria-label={`Quantity ${item.qty}`}>{item.qty}</div>
                        <button type="button" className="qty-btn" onClick={() => incrementQty(item.key)} aria-label="Increase quantity">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98457D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 5v14"></path>
                            <path d="M5 12h14"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button type="button" className={`add-btn ${cartItems.length ? '' : 'disabled'}`} onClick={sendOrder} disabled={!cartItems.length}>
                <span>Send order</span>
              </button>
              {cartItems.length ? <p className="detail-hint">This copies your order and opens Instagram ({INSTAGRAM_PLACEHOLDER}).</p> : null}
            </div>
          </div>
        </main>
      ) : null}

      {removeConfirmKey ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Remove item">
          <div className="modal">
            <div className="modal-title">Remove this item?</div>
            <div className="modal-actions">
              <button type="button" className="modal-btn" onClick={() => setRemoveConfirmKey(null)}>Cancel</button>
              <button type="button" className="modal-btn danger" onClick={() => removeItem(removeConfirmKey)}>Remove</button>
            </div>
          </div>
        </div>
      ) : null}

      {toastMessage ? (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}
    </div>
  )
}

export default App
