import Observable from '../../Observable.js';
export default class ViewMediator extends Observable {
    constructor(element, mediatorFactory) {
        super();
        this.element = element;
        this.mediatorFactory = mediatorFactory;
        this.object3D = this.makeObject3D();

        this.object3D.name = element.name;
        this.childMediators = new Map();
        this.object3D.traverse((object3D) => {
            object3D.mediator = this;
        });


    }

    makeObject3D() {
        const container = new THREE.Object3D();
        container.add(new THREE.Object3D());
        return container;
    }

    addChild(child) {

        const mediator = this.mediatorFactory.getMediator(child);
        this.childMediators.set(child, mediator);
        
        this.object3D.children[0].add(mediator.object3D);
        
        if (child !== undefined) {
            if (typeof child[Symbol.iterator] === 'function') {//Check if iterable
                for (const childofChild of child) {
                    mediator.addChild(childofChild);
                }
            }
        }
    }

    removeChild(child) {
        const mediator = this.childMediators.get(child);

        if (mediator) {
            this.object3D.children[0].remove(mediator.object3D);
            this.childMediators.delete(child);
        }
    }

    onFrameRenderered() {
        for (const childMediator of this.childMediators.values()) {
            childMediator.onFrameRenderered();
        }
    }
}
