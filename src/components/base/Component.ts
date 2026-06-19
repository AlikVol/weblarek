
export abstract class Component<T extends object> {  
    props: T;
    protected constructor(protected readonly container: HTMLElement, props?: T) {
        this.props = props || {} as T;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this.props, data ?? {});  
        return this.container;
    }
}
