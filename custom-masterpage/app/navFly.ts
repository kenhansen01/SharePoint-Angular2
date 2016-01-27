export class FlyDown {
    flyingNavs: HTMLCollection;
    flyingArray: Array<HTMLElement>;
    totalHeight: number;
    listItemFilter: boolean;

    constructor(flyingNavsSelector: string) {
        this.flyingNavs = <HTMLCollection>document.querySelectorAll(flyingNavsSelector);
        this.flyingArray = Array.prototype.slice.call(this.flyingNavs);
    }

    howHigh(el: HTMLElement, filter: Function): number {
        let
            sibsHeight: number = 0,
            element = el;
        while (element.previousSibling && element.nodeName == element.previousSibling.nodeName) {
            if (!filter || filter(element)) {
                element = <HTMLElement>element.previousSibling;
                sibsHeight += element.offsetHeight;
            }
        }
        return sibsHeight + 1;
    }

    isListItem(el: HTMLElement): boolean {
        let nodeName = el.nodeName.toUpperCase();
        if (nodeName == 'LI')
            return true;
        return false;
    }

    onmouseenter(el: HTMLElement) {
        let element: HTMLElement = el;
        element.addEventListener('mouseover', (event) => {
            let
                childUl: HTMLElement = element.getElementsByTagName('ul')[0],
                parentUl: HTMLElement = <HTMLElement>element.parentNode,
                parentHeight: number = parentUl.offsetHeight,
                childHeight: number = childUl.offsetHeight,
                prevLIHeights: string = '-' + this.howHigh(element, this.isListItem) + 'px';

            childUl.style.top = prevLIHeights;
            if (parentHeight < childHeight - 2) {
                childUl.style.height = childHeight + 'px';
                parentUl.style.height = childHeight + 'px';
            }
            else if (parentHeight > childHeight + 2) {
                parentUl.style.height = parentHeight + 'px';
                childUl.style.height = parentHeight + 'px';
            }
        })
    }

    onmouseleave(el: HTMLElement) {
        let element: HTMLElement = el;
        element.addEventListener('mouseleave', (event) => {
            let parentUl: HTMLElement = <HTMLElement>element.parentNode;
            parentUl.style.height = 'auto';
        })
    }

    adjustFly() {
        for (let listEl of this.flyingArray) {
            this.onmouseenter(listEl);
            this.onmouseleave(listEl);
        }
    }
}
