export type RoleKey = 'user' | 'admin'

/** 语义色调:用于 tag / metric / 状态徽章 */
export type Tone = 'green' | 'orange' | 'red' | 'purple'

/** tag 单元格(表格/卡片中的状态标签) */
export interface TagData {
  kind: 'tag'
  text: string
  tone?: Tone
}

/** 操作按钮单元格(表格中「操作」列的多个链接按钮) */
export interface ActionData {
  kind: 'actions'
  items: string[]
}

/** 表格单元格:纯文本/数字,或 tag/actions 结构 */
export type TableCell = string | number | TagData | ActionData

/** 单元格/列的水平对齐方式 */
export type ColumnAlign = 'left' | 'center' | 'right'

/** 排序方向:null 表示未排序 */
export type SortOrder = 'asc' | 'desc' | null

/** 列描述:声明式配置一列的对齐、宽度、排序能力。
 *  不传 columns 时,DataTable 退化为用 headers + colWidths 的老用法。 */
export interface ColumnConfig {
  /** 列标识:同时作为排序字段名回传给父组件 */
  key: string
  /** 列标题(等价于 headers[i]) */
  header: string
  /** 该列对齐方式,默认 'left'。操作列(actions 单元格)始终居中,忽略此值 */
  align?: ColumnAlign
  /** 该列宽度(CSS 长度,如 '120px' / '1fr'),等价于 colWidths[i] */
  width?: string
  /** 该列是否可排序,默认 false。排序由父组件执行,组件只负责 UI 与事件 */
  sortable?: boolean
}

/** 指标卡(MetricCards 用) */
export interface MetricItem {
  label: string
  value: string
  desc: string
  tone?: Tone
}

/** 卡片网格项(CardGrid 用) */
export interface CardItem {
  title: string
  description: string
  badge?: TagData
  meta?: string[]
}

/** 时间线项(TimelineCard 用) */
export interface TimelineItem {
  title: string
  description: string
}

/** 看板项(KanbanBoard 用) */
export interface KanbanItem {
  title: string
  progress?: number
}

export interface KanbanLane {
  title: string
  items: KanbanItem[]
}

/** 导航:一个二级页面(section) */
export interface NavigationSection {
  id: string
  name: string
  path: string
  abilities: string[]
  /** 权限码:当前 session 的 permissions 包含此项时才可见 */
  permissionCode?: string
  /** IAM 角色要求:当前 session 的 roles 需全部包含才可见 */
  requiredIamRoles?: string[]
  /** 显式隐藏(仍可通过 url 访问,但不进导航和权限过滤) */
  visible?: boolean
}

/** 导航:一组 section 的父级模块 */
export interface NavigationModule {
  id: string
  name: string
  subtitle: string
  path: string
  sections: NavigationSection[]
}

/** 角色配置(user / admin 各一套导航) */
export interface RoleConfig {
  key: RoleKey
  label: string
  avatar: string
  defaultPageId: string
  modules: NavigationModule[]
}
