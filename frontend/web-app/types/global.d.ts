// React types
declare namespace React {
  interface FormEvent<T = Element> {
    preventDefault(): void
  }
  
  interface ChangeEvent<T = Element> {
    target: T & {
      value: string
    }
  }
  
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T
    props: P
    key: string | number | null
  }
  
  type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[]
  
  interface Component<P = {}, S = {}> {
    props: P
    state: S
    render(): ReactNode
  }
  
  type JSXElementConstructor<P> = (props: P) => ReactElement | null
}

// Module declarations
declare module 'react' {
  export function useState<T>(initialState: T): [T, (value: T) => void]
  export function useEffect(effect: () => void, deps?: any[]): void
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T
  export function useMemo<T>(factory: () => T, deps: any[]): T
}

declare module 'lucide-react' {
  interface LucideProps {
    className?: string
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }
  
  export const Search: React.ComponentType<LucideProps>
  export const MapPin: React.ComponentType<LucideProps>
  export const Home: React.ComponentType<LucideProps>
  export const Filter: React.ComponentType<LucideProps>
  export const Heart: React.ComponentType<LucideProps>
  export const Bed: React.ComponentType<LucideProps>
  export const Bath: React.ComponentType<LucideProps>
  export const Square: React.ComponentType<LucideProps>
  export const Star: React.ComponentType<LucideProps>
  export const Users: React.ComponentType<LucideProps>
  export const TrendingUp: React.ComponentType<LucideProps>
  export const Award: React.ComponentType<LucideProps>
  export const CheckCircle: React.ComponentType<LucideProps>
  export const Shield: React.ComponentType<LucideProps>
  export const Zap: React.ComponentType<LucideProps>
  export const Globe: React.ComponentType<LucideProps>
  export const Smartphone: React.ComponentType<LucideProps>
  export const Download: React.ComponentType<LucideProps>
  export const ArrowRight: React.ComponentType<LucideProps>
  export const Eye: React.ComponentType<LucideProps>
  export const EyeOff: React.ComponentType<LucideProps>
  export const Mail: React.ComponentType<LucideProps>
  export const Lock: React.ComponentType<LucideProps>
  export const User: React.ComponentType<LucideProps>
  export const Phone: React.ComponentType<LucideProps>
  export const ArrowLeft: React.ComponentType<LucideProps>
  export const Share2: React.ComponentType<LucideProps>
  export const Calendar: React.ComponentType<LucideProps>
  export const ChevronLeft: React.ComponentType<LucideProps>
  export const ChevronRight: React.ComponentType<LucideProps>
  export const Camera: React.ComponentType<LucideProps>
  export const Edit: React.ComponentType<LucideProps>
  export const Trash2: React.ComponentType<LucideProps>
  export const Plus: React.ComponentType<LucideProps>
  export const Settings: React.ComponentType<LucideProps>
  export const Bell: React.ComponentType<LucideProps>
  export const MessageSquare: React.ComponentType<LucideProps>
  export const Grid: React.ComponentType<LucideProps>
  export const List: React.ComponentType<LucideProps>
}

declare module 'next/link' {
  interface LinkProps {
    href: string
    className?: string
    children: React.ReactNode
  }
  export default function Link(props: LinkProps): JSX.Element
}

declare module 'next/image' {
  interface ImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
  }
  export default function Image(props: ImageProps): JSX.Element
}

declare module 'framer-motion' {
  export const motion: any
}

// JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    div: any
    form: any
    input: any
    select: any
    option: any
    button: any
    p: any
    strong: any
    span: any
    h1: any
    h2: any
    h3: any
    h4: any
    h5: any
    h6: any
    img: any
    a: any
    ul: any
    li: any
    nav: any
    header: any
    main: any
    footer: any
    section: any
    article: any
    aside: any
    label: any
    textarea: any
    fieldset: any
    legend: any
    table: any
    thead: any
    tbody: any
    tr: any
    th: any
    td: any
    blockquote: any
    cite: any
    code: any
    pre: any
    hr: any
    br: any
    em: any
    i: any
    b: any
    u: any
    small: any
    sub: any
    sup: any
    mark: any
    del: any
    ins: any
    kbd: any
    samp: any
    var: any
    abbr: any
    acronym: any
    address: any
    bdo: any
    big: any
    tt: any
    q: any
    dfn: any
    time: any
    progress: any
    meter: any
    details: any
    summary: any
    dialog: any
    menu: any
    menuitem: any
    datalist: any
    keygen: any
    output: any
    canvas: any
    audio: any
    video: any
    source: any
    track: any
    embed: any
    object: any
    param: any
    iframe: any
    map: any
    area: any
    base: any
    link: any
    meta: any
    script: any
    style: any
    title: any
    head: any
    body: any
    html: any
  }
  
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any, any> {}
  interface ElementAttributesProperty {
    props: {}
  }
  interface ElementChildrenAttribute {
    children: {}
  }
}
