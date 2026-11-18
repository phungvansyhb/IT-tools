export type CategoryId =
  | 'image'
  | 'file'
  | 'text'
  | 'color'
  | 'calculators'
  | 'cheatsheets';

export type ToolId =
  | 'image-converter'
  | 'image-compressor'
  | 'image-base64'
  | 'svg-optimizer'
  | 'data-converter'
  | 'file-hash'
  | 'file-inspector'
  | 'file-diff'
  | 'case-converter'
  | 'regex-tester'
  | 'jwt-decoder'
  | 'id-generator'
  | 'text-encoder'
  | 'color-converter'
  | 'contrast-checker'
  | 'palette-generator'
  | 'glass-generator'
  | 'chmod-calculator'
  | 'cron-calculator'
  | 'timestamp-converter'
  | 'unit-base-calculator'
  | 'git-cheatsheet'
  | 'http-cheatsheet'
  | 'devops-cheatsheet';

export type CheatsheetEntryId =
  | 'git-interactive-rebase'
  | 'git-reflog-recover'
  | 'git-worktree-add'
  | 'git-amend-no-edit'
  | 'git-stash-untracked'
  | 'gh-pr-create'
  | 'gh-pr-checks'
  | 'http-200-204'
  | 'http-301-308'
  | 'http-401-403'
  | 'http-422-429'
  | 'http-502-504'
  | 'http-cache-control'
  | 'http-cors-preflight'
  | 'regex-lookahead-password'
  | 'regex-named-group'
  | 'linux-ss-ports'
  | 'linux-journalctl-tail'
  | 'docker-exec-shell'
  | 'docker-compose-rebuild';

export interface CommonDictionary {
  brand: {
    name: string;
    subtitle: string;
    siteName: string;
    siteTagline: string;
  };
  nav: {
    primaryAria: string;
    closeSidebar: string;
    openMenu: string;
    searchTools: string;
    categoriesHeading: string;
    pinnedTools: string;
    pinnedEmptyHint: string;
    privacyTitle: string;
    privacyDesc: string;
    syncSupabase: string;
    syncLocal: string;
    openPaletteAria: string;
    jumpToCommand: string;
    favorites: string;
    toggleFavoritesAria: string;
    pinnedToolsCount: string;
    closeFavoritesAria: string;
    noPinnedTools: string;
    unpinToolAria: string;
    pinToolAria: string;
    removeFromFavorites: string;
    pinToFavorites: string;
    switchToLightAria: string;
    switchToDarkAria: string;
    switchToLightTitle: string;
    switchToDarkTitle: string;
    languageSwitcherAria: string;
    languageLabel: string;
  };
  commandPalette: {
    dialogAria: string;
    placeholder: string;
    searchAria: string;
    closeAria: string;
    emptyState: string;
    navigateHint: string;
    openHint: string;
    closeHint: string;
  };
  actions: {
    copy: string;
    copied: string;
    home: string;
    all: string;
    swap: string;
    download: string;
    save: string;
    delete: string;
    clear: string;
  };
  home: {
    badgeNative: string;
    badgeCount: string;
    heroTitle: string;
    heroSubtitle: string;
    filterPlaceholder: string;
    filterAria: string;
    openJwtDecoder: string;
    telemetryTitle: string;
    statBrowserTools: string;
    statPinned: string;
    statNetworkUploads: string;
    statNetworkUploadsValue: string;
    statCategories: string;
    statSuitesValue: string;
    pinnedHeading: string;
    pinnedSavedSub: string;
    categoriesHeading: string;
    categoriesSub: string;
    toolsCountPill: string;
    allToolsHeading: string;
    allFilterPill: string;
    noToolsMatch: string;
  };
  categoryPage: {
    toolsPill: string;
  };
  bentoCard: {
    runSingular: string;
    runPlural: string;
  };
  toolWorkspace: {
    localRunsPill: string;
    pinned: string;
    pinTool: string;
    savePreset: string;
    linkCopied: string;
    shareState: string;
    presetPlaceholder: string;
    presetDefaultName: string;
    saveToWorkspace: string;
    savedPresetsLabel: string;
    deletePresetAria: string;
    workspaceAria: string;
    howItWorksTitle: string;
    faqTitle: string;
    relatedTitle: string;
    untitledPreset: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    homeKeywords: string[];
    categoryTitleTemplate: string;
    categoryOgTitleTemplate: string;
    categoryTwitterTitleTemplate: string;
    toolTitleTemplate: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  locales: {
    en: string;
    vi: string;
    ja: string;
    zh: string;
  };
}

export interface LocalizedCategoryContent {
  name: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export interface LocalizedToolFaq {
  question: string;
  answer: string;
}

export interface LocalizedToolContent {
  name: string;
  shortDescription: string;
  longDescription: string;
  keywords: string[];
  howItWorks: string[];
  faqs: LocalizedToolFaq[];
}

export interface CatalogDictionary {
  categories: Record<CategoryId, LocalizedCategoryContent>;
  tools: Record<ToolId, LocalizedToolContent>;
}

export interface ToolsDictionary {
  engines: {
    file: {
      conversionFailed: string;
      formats: {
        png: string;
        jpeg: string;
        gif: string;
        pdf: string;
        zip: string;
        gzip: string;
        wasm: string;
        elf: string;
        sqlite: string;
        mp3: string;
        ogg: string;
        flac: string;
        webp: string;
        wav: string;
        svg: string;
        json: string;
        plainText: string;
        octetStream: string;
      };
    };
    text: {
      invalidRegex: string;
      pasteJwt: string;
      jwtSegmentsError: string;
      jwtParseError: string;
    };
    calculators: {
      cronFieldsError: string;
      cronSyntaxError: string;
      cronEveryMinute: string;
      cronEveryNMinutes: string;
      cronAtMinute: string;
      cronOfEveryHour: string;
      cronEveryNHours: string;
      cronPastHour: string;
      cronOnDom: string;
      cronInMonths: string;
      cronOnlyOnDows: string;
      months: [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      dows: [string, string, string, string, string, string, string];
      timestampEmpty: string;
      timestampInvalid: string;
      justNow: string;
      inFuture: string;
      pastAgo: string;
      unitSec: string;
      unitMin: string;
      unitHour: string;
      unitDay: string;
      baseEmpty: string;
      baseInvalid: string;
    };
  };
  imageSuite: {
    readFileError: string;
    invalidImageError: string;
    unableToLoadError: string;
    rawSvgTitle: string;
    loadSvgBtn: string;
    rawSvgAria: string;
    originalPill: string;
    minifiedPill: string;
    savedPill: string;
    previewOutputTitle: string;
    copySvgBtn: string;
    pasteValidSvg: string;
    optimizedSvgAria: string;
    dropTitle: string;
    dropSubtitle: string;
    selectImageTitle: string;
    dataUrlTitle: string;
    copyDataUrl: string;
    copyRawBase64: string;
    dataUrlPlaceholder: string;
    copyCssUrl: string;
    copyHtmlImg: string;
    sourceSettingsTitle: string;
    targetFormatLabel: string;
    formatWebp: string;
    formatJpeg: string;
    formatPng: string;
    qualityLabel: string;
    resizeDimensionsLabel: string;
    lockAspectLabel: string;
    targetWidthAria: string;
    targetHeightAria: string;
    convertedPreviewTitle: string;
    downloadBtn: string;
    beforePill: string;
    afterPill: string;
    smallerPill: string;
    largerPill: string;
    convertedAlt: string;
    emptyHint: string;
  };
  fileSuite: {
    inputHeading: string;
    sourceFormatAria: string;
    swapFormatsAria: string;
    targetFormatAria: string;
    structuredInputAria: string;
    outputHeading: string;
    copyFormatBtn: string;
    parseError: string;
    structuredOutputAria: string;
    hashInputTitle: string;
    dropHashTitle: string;
    dropHashSub: string;
    hashTextLabel: string;
    expectedHashLabel: string;
    expectedHashPlaceholder: string;
    checksumMatch: string;
    checksumMismatch: string;
    digestsTitle: string;
    computing: string;
    selectMagicTitle: string;
    dropMagicTitle: string;
    dropMagicSub: string;
    samplePngName: string;
    inspectSampleBtn: string;
    magicReportTitle: string;
    confidenceExact: string;
    confidenceHeuristic: string;
    leadingHexLabel: string;
    asciiPreviewLabel: string;
    magicEmpty: string;
    diffOriginalTitle: string;
    diffModifiedTitle: string;
    diffOutputTitle: string;
    diffAdded: string;
    diffRemoved: string;
  };
  textSuite: {
    inputStringTitle: string;
    casePlaceholder: string;
    statCharacters: string;
    statBytes: string;
    statWords: string;
    statLines: string;
    convertedConventionsTitle: string;
    patternPayloadTitle: string;
    regexPatternPlaceholder: string;
    regexPatternAria: string;
    regexFlagsPlaceholder: string;
    regexFlagsAria: string;
    regexTextAria: string;
    matchesTitle: string;
    regexEngineBadge: string;
    noMatches: string;
    thIndex: string;
    thMatch: string;
    thSpan: string;
    thGroups: string;
    encodedJwtTitle: string;
    copyTokenBtn: string;
    jwtStatusPrefix: string;
    jwtStatusValid: string;
    jwtStatusExpired: string;
    jwtStatusNotYetValid: string;
    jwtStatusNoExpiry: string;
    decodedClaimsTitle: string;
    joseHeader: string;
    payloadClaims: string;
    generatorConfigTitle: string;
    identifierFormatLabel: string;
    formatUuid: string;
    formatUlid: string;
    formatNanoid: string;
    formatToken: string;
    batchCountLabel: string;
    charLengthLabel: string;
    alphabetLabel: string;
    charsetAlpha: string;
    charsetHex: string;
    charsetBase64url: string;
    charsetSymbols: string;
    regenerateBtn: string;
    generatedIdsTitle: string;
    copyAllBtn: string;
    sourceTextTitle: string;
    modeEncode: string;
    modeDecode: string;
    modeToggle: string;
    encodedOutputTitle: string;
    decodedOutputTitle: string;
    copyOutputBtn: string;
    conversionFailed: string;
  };
  colorSuite: {
    pickerTitle: string;
    pickerAria: string;
    hexInputAria: string;
    spacesTitle: string;
    colorPairTitle: string;
    foregroundLabel: string;
    backgroundLabel: string;
    wcagTitle: string;
    invalidColor: string;
    aaNormal: string;
    aaLarge: string;
    aaaNormal: string;
    aaaLarge: string;
    specimenHeading: string;
    specimenBody: string;
    copyCssVarsBtn: string;
    copyJsonBtn: string;
    glassControlsTitle: string;
    bgOpacityLabel: string;
    backdropBlurLabel: string;
    saturationLabel: string;
    borderAlphaLabel: string;
    borderRadiusLabel: string;
    liveStageTitle: string;
    copyCssBtn: string;
    previewCardTitle: string;
    previewCardSubtitle: string;
  };
  calculatorSuite: {
    permissionsMatrixTitle: string;
    roleOwner: string;
    roleGroup: string;
    roleOthers: string;
    permRead: string;
    permWrite: string;
    permExecute: string;
    thScope: string;
    thRead: string;
    thWrite: string;
    thExecute: string;
    octalSymbolicTitle: string;
    octalModeLabel: string;
    symbolicLabel: string;
    shellCommandLabel: string;
    cronTitle: string;
    cronAria: string;
    presetEvery5Min: string;
    presetHourly: string;
    presetDaily: string;
    presetWeekdays: string;
    presetMonthly: string;
    nextRunsTitle: string;
    copyCronBtn: string;
    cronEmptyHint: string;
    runIndex: string;
    epochTitle: string;
    nowBtn: string;
    unixSecondsLabel: string;
    unixMsLabel: string;
    isoUtcLabel: string;
    timezoneMatrixTitle: string;
    storageBandwidthTitle: string;
    storageQuantityAria: string;
    storageUnitAria: string;
    linkSpeedLabel: string;
    numberBaseTitle: string;
    integerValueAria: string;
    inputRadixAria: string;
    radixDec: string;
    radixHex: string;
    radixBin: string;
    radixOct: string;
    baseBinLabel: string;
    baseOctLabel: string;
    baseDecLabel: string;
    baseHexLabel: string;
  };
  cheatsheetSuite: {
    filterPlaceholder: string;
    filterAria: string;
    allFilterPill: string;
    pinSnippetAria: string;
    unpinSnippetAria: string;
  };
}

export interface LocalizedCheatsheetContent {
  group: string;
  title: string;
  description: string;
  tags: string[];
}

export interface CheatsheetsDictionary {
  entries: Record<CheatsheetEntryId, LocalizedCheatsheetContent>;
}

export interface LocaleBundle {
  common: CommonDictionary;
  catalog: CatalogDictionary;
  tools: ToolsDictionary;
  cheatsheets: CheatsheetsDictionary;
}
