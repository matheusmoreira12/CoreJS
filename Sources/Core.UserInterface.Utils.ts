namespace Core.UserInterface.Utils {
    export function prependChild(elem: Node, child: Node): void {
        if (elem.childNodes.length > 0)
            elem.insertBefore(child, elem.childNodes.item(0));
        else
            elem.appendChild(child);
    }
}
