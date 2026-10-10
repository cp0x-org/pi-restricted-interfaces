// Simplified Chinese (zh-CN) UI strings. Typed by Messages: a missing or extra key fails the build.
import type { Messages } from './en';

export const zh: Messages = {
  htmlLang: 'zh-CN',
  intlLocale: 'zh-Hans',
  labels: {
    LEVEL_LABELS: { D: 'D', C: 'C', B: 'B', A: 'A', 'n/a': '?' },
    LEVEL_DESCRIPTIONS: {
      D: '超过 20 项限制',
      C: '6–20 项限制',
      B: '1–5 项限制',
      A: '未发现技术性限制',
      'n/a': '无法确定'
    },
    STATUS_LABELS: { yes: '是', no: '否', reported: '有报道', tos_only: '仅条款', optional: '可选', unknown: '暂无' },
    STATUS_DESCRIPTIONS: {
      yes: '已由代码、实测或官方文档确认',
      no: '已检查，未发现',
      reported: '来自媒体或用户报道，代码中未确认',
      tos_only: '仅在服务条款中保留该权利，未发现实际执行',
      optional: '代码中存在，但默认关闭',
      unknown: '未检查或无法检查'
    },
    LAYER_LABELS: { edge: '边缘 / CDN', frontend: '前端', 'own-api': '运营方 API', 'protocol-api': '协议 API' },
    LAYER_DESCRIPTIONS: {
      edge: 'CDN 或托管规则（在任何 JavaScript 运行前按国家返回 HTTP 403/451/302）',
      frontend: '客户端 JavaScript：分叉可直接移除',
      'own-api': '仅官方前端调用的后端：分叉不需要它',
      'protocol-api': '协议所有客户端都依赖的后端（订单簿、索引器、路由器）：分叉会继承该限制'
    },
    FAIL_LABELS: { open: '失败放行', closed: '失败拦截', unknown: '暂无', 'n/a': '不适用' },
    VPN_LABELS: { no: '否', tos_only: '仅条款', detect: '检测', block: '封锁', optional: '可选', unknown: '暂无' },
    REPO_STATE_LABELS: {
      open: '开源',
      open_stale: '开源（已过时）',
      closed: '闭源',
      private_now: '已转为私有',
      archived: '已归档',
      none_found: '未找到'
    },
    FORK_LABELS: { yes: '可分叉', stale: '代码过时', partial: '部分可行', no_code: '无代码' },
    FORK_DESCRIPTIONS: {
      yes: '前端开源，分叉时可移除限制',
      stale: '代码开源但已过时或归档，生产版本已更新',
      partial: '前端开源，但筛查在协议 API 中执行，分叉仍依赖该 API',
      no_code: '没有公开的前端代码'
    },
    TOS_US_LABELS: { yes: '禁止', no: '允许', partial: '部分', unknown: '暂无' },
    COUNTRY_STATUS_LABELS: {
      blocked: '封锁',
      close_only: '仅可平仓',
      feature_limited: '功能受限',
      regional: '部分地区',
      tos_only: '仅条款',
      unknown: '暂无',
      ok: '未发现限制'
    },
    COUNTRY_STATUS_DESCRIPTIONS: {
      blocked: '该国家无法访问网站或进行交易',
      close_only: '只能平掉已有仓位，不能开新仓',
      feature_limited: '该国家无法使用部分功能或资产',
      regional: '仅该国的部分地区受限',
      tos_only: '服务条款中点名了该国家，但未发现技术执行',
      unknown: '未评估，或国家名单未公开',
      ok: '未发现国家层面的限制（钱包筛查和 VPN 检测仍可能适用）'
    },
    BASIS_LABELS: { observed: '实测', confirmed: '已确认', reported: '有报道', inferred: '推断', tos: '条款' },
    BASIS_DESCRIPTIONS: {
      observed: '通过已验证的当地代理实测（不执行 JavaScript 的 HTTP 探测）',
      confirmed: '已由代码、实测或官方文档确认',
      reported: '基于媒体或用户报道',
      inferred: '因未发现限制而推断；闭源代码可能隐藏更多限制',
      tos: '仅基于服务条款'
    },
    CATEGORY_GROUP_LABELS: {
      dex: 'DEX',
      aggregator: '聚合器',
      perps: '永续合约',
      lending: '借贷',
      staking: '质押',
      yield: '收益',
      rwa: '现实世界资产（RWA）',
      stablecoin: '稳定币',
      bridge: '跨链桥',
      prediction: '预测市场',
      wallet: '钱包',
      other: '其他'
    },
    OBS_STATE_LABELS: {
      ok: '正常访问',
      blocked: '封锁',
      close_only: '仅可平仓',
      feature_limited: '功能受限',
      challenge: '反机器人验证',
      error: '错误',
      unknown: '暂无'
    },
    PROXY_TYPE_LABELS: {
      residential: '住宅',
      isp: 'ISP（静态住宅）',
      mobile: '移动网络',
      datacenter: '数据中心',
      tor: 'Tor',
      direct: '直连'
    },
    MECHANISM_LABELS: { geo_site: '地区封锁', geo_feature: '功能限制', screening: '钱包筛查', vpn: 'VPN / Tor 检测', kyc: 'KYC / 白名单' },
    CONFIDENCE_LABELS: { high: '高', medium: '中', low: '低' },
    REGION_LABELS: {
      'UA-Crimea': '克里米亚和塞瓦斯托波尔',
      'UA-DPR': '顿涅茨克地区（DPR）',
      'UA-LPR': '卢甘斯克地区（LPR）',
      'UA-Kherson': '赫尔松地区',
      'UA-Zaporizhzhia': '扎波罗热地区',
      'US-NY': '纽约州',
      'CA-ON': '安大略省',
      'CA-BC': '不列颠哥伦比亚省',
      'CA-AB': '艾伯塔省',
      'CA-QC': '魁北克省',
      'GE-Abkhazia': '阿布哈兹',
      'GE-SouthOssetia': '南奥塞梯',
      'CY-North': '北塞浦路斯'
    }
  },
  layout: {
    home: '首页',
    permissionless: '无需许可界面',
    referrals: 'cp0x 推荐计划',
    menu: '菜单',
    skip: '跳到主要内容',
    sections: '栏目',
    mainNav: '主导航',
    tabs: { monitor: '监测', country: '按国家', methodology: '方法论' },
    language: '语言',
    homeLogo: 'cp0x DeFi 界面限制监测，首页',
    support: '支持 cp0x',
    telegram: 'cp0x 的 Telegram',
    twitter: 'cp0x 的 X（Twitter）',
    github: 'cp0x 的 GitHub'
  },
  pageTitle: {
    monitor: 'DeFi 界面限制监测 | cp0x',
    methodology: '方法论：如何检查 DeFi 界面限制 | cp0x',
    iface: (name, level) => `${name} 地区封锁与钱包筛查（评级 ${level}）| cp0x`,
    notFound: '页面不存在 | cp0x'
  },
  monitor: {
    title: '官方 DeFi 界面：谁在限制什么',
    intro: (shown, total, date) => `DeFi 协议的官方界面按其实施的技术性限制评级：限制越少越好。点击任意一行查看依据。数据快照：${date}。`,
    search: '搜索',
    searchPlaceholder: '名称或域名',
    category: '类别',
    network: '网络',
    level: '评级',
    screeningLayer: '筛查层',
    country: '国家',
    restrictedIn: (flags) => `在 ${flags} 受限：`,
    hasMechanism: '包含机制：',
    openOnly: '仅开源前端',
    tableLabel: '界面限制表',
    cols: {
      iface: '界面',
      category: '类别',
      level: '评级',
      geo: '地区封锁',
      feature: '功能限制',
      screening: '钱包筛查',
      vpn: 'VPN',
      code: '代码',
      official: '官方应用',
      permissionless: '无需许可应用'
    },
    multiCountry: (flags) => `${flags} 限制`,
    sortBy: '排序方式',
    reverseOrder: '反转顺序',
    countries: (n) => `${n} 个国家`,
    closeOnly: (n) => `${n} 个仅可平仓`,
    empty: '没有符合当前筛选条件的界面。',
    showing: (shown, total) => `显示 ${shown} / ${total} 个界面`,
    rows: '每页行数',
    legendToggle: '如何阅读此表',
    methodologyLink: '完整方法论 →',
    restrictionsTip: (n, countries, mechanisms) =>
      n === 0
        ? '未发现技术性限制（仅写在服务条款中的限制不计入）'
        : `${n} 项限制：${[countries ? `${countries} 个国家或地区` : '', mechanisms].filter(Boolean).join(' + ')}`
  },
  tiles: {
    interfaces: '界面',
    open: '开源前端',
    closed: '闭源前端',
    permissionless: 'cp0x 无需许可版本'
  },
  legend: {
    level: '限制越少评级越高：A 为无限制，B 为 1–5 项，C 为 6–20 项，D 超过 20 项；无法确定时为“暂无”。数字表示计入的限制数量。',
    geo: '整站或交易对部分国家封锁。',
    feature: '网站可用，但部分功能或资产按国家隐藏。',
    screening: '钱包地址会与制裁名单比对；下方小字标明在哪一层执行。',
    vpn: '是否检测或封锁 VPN、Tor 用户。',
    code: '公开的前端代码仓库。',
    official: '官方界面。',
    permissionless: '来自 pi.cp0x.com 的无需许可界面；这些行排在最前。',
    legacy: '协议正在逐步淘汰的旧版界面；排在最后',
    vpnDetect: 'VPN 或 Tor 用户会被识别，只能使用受限模式或会看到警告',
    vpnBlock: 'VPN 或 Tor 用户被拒绝访问'
  },
  chips: {
    regions: '地区',
    basis: '依据',
    liveProbe: (date, proxy, state, http, url) => `${date} 通过${proxy}代理实测：${state}（HTTP ${http}，${url}）`,
    disagrees: '——与静态结论不一致',
    probed: (date) => `实测 ${date}`,
    conflict: '冲突',
    servedNotEdge: '（首页可访问：封锁不在边缘层）',
    disagreesShort: '（与静态结论不一致）',
    more: (n) => `另外 ${n} 个`,
    less: '收起',
    nothing: '无记录。',
    noEvidence: '无证据记录。',
    frontendCodeOf: (name) => `${name} 的前端代码`,
    legacy: '旧版'
  },
  iface: {
    notFound: '未找到该界面',
    notFoundText: (id) => `目录中没有 ID 为“${id}”的界面。`,
    back: '返回监测页',
    all: '全部界面',
    legacyTitle: '旧版界面',
    otherVersions: '该协议的其他版本',
    frontendCode: '前端代码',
    altPrefix: '无需许可替代版本：',
    forkReadiness: '分叉可行性',
    lastCommit: (date) => ` · 最近提交 ${date}`,
    confidence: '可信度',
    checked: '检查日期',
    howEnforced: '执行方式',
    blockedCountries: '封锁国家',
    closeOnlyCountries: '仅可平仓国家',
    scope: '范围',
    assetFilter: '资产过滤',
    affected: '受影响国家',
    provider: '服务商 / 接口',
    whereRuns: '执行位置',
    failMode: '失败模式',
    note: '备注',
    kycScope: '受限内容',
    tos: '服务条款',
    usPersons: '美国用户',
    document: '文档',
    notFoundDoc: '未找到',
    lastUpdated: '最近更新',
    restrictedAsWritten: '受限司法管辖区（原文）',
    named: '点名的司法管辖区',
    allInGeoBlock: (n) => (n === 1 ? '已列于上方地区封锁中' : `${n} 个均已列于上方地区封锁中`),
    namedOnlyInTerms: '仅在条款中列出',
    blockedNotNamed: '已封锁但条款中未列出',
    forkNotes: '分叉说明',
    noNotes: '暂无说明。',
    repoStatus: '代码仓库状态',
    liveChecks: '实测记录',
    noLive: '暂无实测记录。',
    egress: '出口',
    probeEndpoints: '探测接口',
    observations: '各国实测结果',
    notProbed: '尚未从各个国家进行实时检测。',
    obsCols: { country: '国家', vantage: '观测点', target: '目标', result: '结果', http: 'HTTP', when: '时间' },
    landing: '首页',
    geoEndpoint: '地区接口',
    evidence: '证据',
    pathsNote: (date) => `路径相对于 ${date} 默认分支的仓库根目录。`,
    tosCountries: '服务条款中点名的国家：',
    dataNote: '机制描述、备注和证据等技术细节保留数据源的英文原文。'
  },
  seo: {
    siteName: 'DeFi 界面限制监测',
    ogSiteName: 'DeFi 界面限制监测 · cp0x',
    langName: '中文',
    noscript: '筛选和排序需要 JavaScript；完整目录见下方。',
    monitorDescription: (n, withAlt) =>
      `哪些官方 DeFi 界面按国家封锁、筛查钱包或隐藏功能：${n} 个 EVM 应用按 A–D 分级，附证据、各国状态和 ${withAlt} 个无需许可替代版本。`,
    methodologyDescription: '监测如何检查 DeFi 界面：按限制数量划分的 A–D 评级、状态值、筛查执行层、国家规则、代理实测与局限。',
    notFoundDescription: 'DeFi 界面限制监测中不存在此页面。',
    ifaceDescription: (name, summary, level, alt) =>
      `${name}：${summary}。评级 ${level}。${alt ? `无需许可替代版本：${alt}。` : ''}含证据、国家名单和分叉说明。`,
    ifacePageName: (name) => `${name}：官方界面的访问限制`,
    datasetName: '官方 DeFi 界面的访问限制',
    datasetDescription:
      '收录 EVM 网络上 DeFi 协议官方网页界面的地区封锁、功能与资产限制、钱包筛查和 VPN 检测，并标注执行层、分叉可行性以及每条结论的证据。',
    summary: {
      geoBlocks: (n) => `封锁 ${n} 个国家`,
      geoBlocksSite: '对整站实施地区封锁',
      geoReported: '有报道的地区封锁',
      geoTos: '仅在服务条款中声明地区封锁',
      closeOnly: (n) => `另有 ${n} 个国家仅可平仓`,
      feature: '按国家隐藏功能或资产',
      screens: (layer) => `筛查钱包${layer ? `（${layer}）` : ''}`,
      vpnBlock: '封锁 VPN 用户',
      vpnDetect: '检测 VPN 用户',
      kyc: '需要 KYC',
      none: '未发现技术限制',
      sep: '；'
    },
    descriptionMax: 100,
    restrictionsTitle: '限制',
    levelSentence: (level, description) => `评级 ${level}：${description}。`,
    legacySentence: (note) => `旧版界面：${note}`,
    checked: (date) => `检查日期：${date}。`,
    countries: '国家',
    closeOnlyList: '仅可平仓',
    colon: '：',
    stop: '。',
    listSep: '、',
    comma: '，'
  },
  method: {
    title: '方法论',
    intro: (date, shown, total) =>
      `本目录为每个界面回答一个问题：官方前端或后端封锁了什么、针对谁、采用什么机制、在哪一层执行，以及无需许可的分叉能否移除它。数据快照：${date}。网站仅显示 EVM 网络：完整目录 ${total} 个界面中的 ${shown} 个；Solana、Cosmos 等非 EVM 应用保留在 \`monitor/data\` 和报告中。我们只做观察：不绕过任何限制，不签名，不发送交易。`,
    levelsTitle: '评级',
    levelsNote:
      '评级统计官方界面的技术性限制：网站、交易或某项功能被封锁的每个国家或地区各计一项，功能或资产限制、钱包筛查（通过 API 或合约）、VPN 检测和 KYC 要求再各计一项。仅写在服务条款中的限制不计入。限制越少评级越高：A 为无限制，B 为 1–5 项，C 为 6–20 项，D 超过 20 项；无法确定时为“暂无”。',
    versionsNote:
      '版本：协议每个版本的官方界面各占一行（例如 app.aave.com 上的 Aave V3 和 pro.aave.com 上的 Aave V4）。只有当协议自己逐步淘汰某个版本时（发布弃用通知、迁到 v2-/v3- 子域名或宣布关闭），我们才把它标为旧版；旧版行排在最后。已无法使用的界面保留在目录中，但不在此显示。',
    statusTitle: '状态值',
    layerTitle: '筛查在哪里执行（层）',
    layerNote:
      '经验法则：如果限制在协议所有客户端都必须调用的服务（订单簿、索引器、路由器、中继器）中执行，就属于协议 API，分叉会继承它；如果只有官方前端调用该服务，就属于运营方自有 API，分叉可以去掉它。',
    countryTitle: '国家状态',
    countryRules: {
      blocked: '该国家在已确认或有报道的整站地区封锁名单中。',
      close_only: '该国家处于整站地区封锁的“仅可平仓”层级（Polymarket）。',
      feature_limited: '该国家在已确认的功能或资产限制名单中，或该界面仅限制美国用户使用部分产品。',
      regional: '只列出了该国的部分地区（克里米亚、顿涅茨克、卢甘斯克、赫尔松、扎波罗热、纽约州、安大略省等）。',
      tos_only: '服务条款点名了该国家或排除了美国用户，但未发现技术执行。',
      unknown: '未评估地区封锁（代码闭源），或已确认存在封锁但国家名单未公开。',
      ok: '以上都不适用；钱包筛查和 VPN 检测仍可能适用。'
    },
    countryNote:
      '规则按上述顺序依次应用，先匹配者生效。每个结论都标注依据：实测（通过已验证代理从该国实测）、已确认（代码、实测或官方文档）、有报道（媒体或用户）、条款（仅服务条款）或推断（未发现限制；闭源前端可能隐藏更多）。实测显示封锁时，会确认静态的封锁 / 仅可平仓 / 功能受限结论，并覆盖更弱的结论；首页可正常访问时，“暂无”或“未发现限制”会升级为实测结论；其他分歧会标记为冲突，并同时展示双方。国家名单使用 ISO 3166-1 代码；“全部欧盟国家”等集合已被展开，而“受制裁司法管辖区”“FATF 高风险”等仍为自由文本，不参与匹配。',
    detectTitle: '如何检测各类机制',
    detectCols: { layer: '层', signal: '信号', examples: '示例' },
    typology: [
      {
        layer: '边缘 / CDN',
        detect:
          '在任何 JavaScript 运行前按国家返回 HTTP 403/451/302；netlify.toml conditions.Country、Next.js middleware req.geo、cf-ipcountry、x-vercel-ip-country',
        examples: 'Hop（451）、Ambient（302 → /blocked.html）、Euler（/api 返回 451）、marginfi'
      },
      {
        layer: '客户端地区检查',
        detect:
          '向地理位置 API 发起 JavaScript 请求：api.country.is、free.freeipapi.com、*/geo/country、/api/geoblock、geolocation.*.workers.dev',
        examples: 'CoW、Venus、Beefy、Polymarket、Drift、Notional、Sushi'
      },
      {
        layer: '带功能开关的运营方地区服务',
        detect: '响应中包含 isRegionRestricted / gatedFeatures / limited',
        examples: 'Sky（/ip/status、geo-config）、Uniswap compliance v2、Lido /api/geo'
      },
      {
        layer: 'VPN 检测',
        detect: 'is_vpn、vpnapi.io、IPQS；Tor 出口标记',
        examples: 'Sky（检测 → 签署条款）、Euler（仅记录）、Liquity（可选）、Lido（Tor → 受限模式）'
      },
      {
        layer: '钱包筛查（外部 API）',
        detect: '连接钱包后立即发出携带地址的请求',
        examples: 'TRM（Sushi、1inch、Aave 历史上）、Hypernative（Balancer）、Elliptic（dYdX）、Chainalysis Entity（Synapse）'
      },
      {
        layer: '钱包筛查（链上）',
        detect: '对 Chainalysis 预言机 0x40C5…C8fb 调用 eth_call isSanctioned()',
        examples: 'Notional、Safe、CoW 后端'
      },
      { layer: '静态名单', detect: '打包代码中的地址数组', examples: 'Compound、Ambient、wormhole-connect、Hop（可选）' },
      {
        layer: '资产限制',
        detect: '代币黑名单或按国家划分的 RWA 列表',
        examples: 'Uniswap、CoW、Beefy、Venus、Sushi、Curve（内容黑名单）'
      }
    ],
    detectNote:
      '开源前端会被克隆并扫描地区和筛查信号（先用 ripgrep 规则，再人工阅读每条收录进目录的命中）。闭源前端依据文档、服务条款和 SDK 中发现的公开接口。交易安全扫描器（Blockaid、Web3 Antivirus）和 Hypernative Guard 属于用户保护，不属于合规筛查，不计入统计。',
    liveTitle: '实测',
    liveP1: (note) => `我们用一个受制裁的测试地址和两个对照地址查询了代码中发现的公开筛查接口。该受制裁地址为：${note}。`,
    liveP2: (egress) =>
      `初始快照的出口：${egress}。这些检查只从一个观测点进行且不执行 JavaScript，因此客户端地区封锁和针对其他国家的封锁只能通过代码看到。`,
    liveP3:
      '按国家探测：通过目标国家的住宅代理、在不执行 JavaScript 的情况下抓取每个界面的首页和已知地区接口。先由多个独立的 IP 地理定位服务验证观测点（至少两个一致），对使用 Cloudflare 的站点还会核对 `/cdn-cgi/trace` 中的 `loc=` 字段；不一致的观测点会被丢弃。结果为以下之一：正常访问、封锁（HTTP 451、带地区说明的 403、跳转到封锁页，或地区接口返回“受限”）、仅可平仓、功能受限，或反机器人验证（无法测试）。“正常访问”只表示未在边缘层观察到封锁：客户端限制、钱包筛查和功能限制不在此类探测范围内。受制裁司法管辖区不做探测，其状态仍根据代码和配置推断。',
    limitsTitle: '局限与数据',
    limits: [
      '生产版本可能与代码仓库不同：Uniswap 发布的是发布镜像，Raydium 和 QuickSwap 保留的是过时快照，还有一些项目（PancakeSwap、Across、Spark）已将前端转为私有。',
      '静态制裁名单与最新 SDN 名单存在偏差：OFAC 已于 2025 年将 Tornado Cash 地址移出名单，但 Compound III 仍在封锁这些地址。测试使用的是测试时仍受制裁的地址。',
      '在客户端渲染的服务条款并非都能读取；这些条目标为“暂无”，不做猜测。'
    ],
    source: (path) =>
      `数据来源：项目仓库中的 \`${path}\`，通过 \`pnpm monitor:build\` 重新生成。每一行都链接到其依据的代码路径、文档或 API 响应。欢迎通过 Pull Request 提交更正。`,
    altLink: 'cp0x 的无需许可替代版本'
  }
};
