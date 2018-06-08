/**
 * Scene.tsx
 *
 * Scene is the top-level component for a scene
 */

import * as React from "react";

import * as THREE from "three";

export type Color = number;

import { Vector3 } from "./Vector";

import { createReconciler, ThreeReconcilerCore } from "./Reconciler";

export type SceneAndCamera = {
  scene: THREE.Scene;
  camera: THREE.Camera;
};

export type DisposeFunction = () => void;
export type NotifyFunction = () => void;

export namespace Components {
  export interface RendererProps {
    width: number;
    height: number;
  }

  export interface RendererState {
    sceneAndCameras: SceneAndCamera[];
  }

  export class Renderer extends React.PureComponent<
    RendererProps,
    RendererState
  > {
    private _mountNode: HTMLElement;

    private _containerElement: HTMLElement;
    private _renderer: THREE.WebGLRenderer;
    // private _scene: THREE.Scene
    // private _camera: THREE.Camera

    private _reconciler: any;
    private _rootObject: THREE.Object3D;
    private _shouldRender;

    constructor(props: RendererProps) {
      super(props);

      this.state = {
        sceneAndCameras: []
      };
    }

    public componentDidMount(): void {
      const { children, width, height } = this.props;
      if (this._containerElement) {
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.autoClear = false;
        this._renderer.setSize(width, height);
        this._containerElement.appendChild(this._renderer.domElement);

        this._rootObject = new THREE.Object3D();
        const reconcilerCore = new ThreeReconcilerCore();
        this._reconciler = createReconciler<THREE.Object3D>(reconcilerCore);

        this._mountNode = this._reconciler.createContainer(this._rootObject);
        this._reconciler.updateContainer(
          this.props.children,
          this._mountNode,
          this
        );

        this._renderScene();
      }
    }

    public componentDidUpdate(prevProps, prevState) {
      if (
        this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height
      ) {
        this._renderer.setSize(this.props.width, this.props.height);
      }

      this._reconciler.updateContainer(
        this.props.children,
        this._mountNode,
        this
      );

      this._renderScene();
    }

    public render(): JSX.Element {
      return (
        <div
          ref={ref => {
            this._containerElement = ref;
          }}
          style={{ overflow: "hidden" }}
        />
      );
    }

    private _renderScene(): void {
      this._renderer.clearColor();
      this._rootObject.children.forEach((sc: THREE.Scene) => {
        const camera: THREE.Camera = sc.userData;
        this._renderer.clearDepth();
        this._renderer.render(sc, camera, null, false);
      });
    }
  }
}
