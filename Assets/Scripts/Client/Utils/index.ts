import {GameObject, Transform, Component, Vector3, LayerMask} from 'UnityEngine';
import {Button, Text, Image, ScrollRect} from 'UnityEngine.UI';

export default class Utils {
  public static FindGameObjectChild(go: GameObject, goName: string = null): GameObject {
    const transform: Transform = this.FindComponentChild(go, goName, 'Transform') as Transform;

    if (transform == null) {
      return null;
    }

    return transform.gameObject;
  }

  public static FindComponentChild(
    go: GameObject,
    componentName: string,
    componentType: string,
  ): Component {
    if (go == null) {
      return null;
    }

    switch (componentType) {
      case 'Button':
        const buttonComponents = go.GetComponentsInChildren<Button>();
        for (let i = 0; i < buttonComponents.length; i++) {
          if (buttonComponents[i].name === componentName) {
            return buttonComponents[i];
          }
        }
        return null;
      case 'Text':
        const textComponents = go.GetComponentsInChildren<Text>();
        for (let i = 0; i < textComponents.length; i++) {
          if (textComponents[i].name === componentName) {
            return textComponents[i];
          }
        }
        return null;
      case 'Image':
        const imageComponents = go.GetComponentsInChildren<Image>();
        for (let i = 0; i < imageComponents.length; i++) {
          if (imageComponents[i].name === componentName) {
            return imageComponents[i];
          }
        }
        return null;
      case 'Transform':
        const transformComponents = go.GetComponentsInChildren<Transform>();
        for (let i = 0; i < transformComponents.length; i++) {
          if (transformComponents[i].name === componentName) {
            return transformComponents[i];
          }
        }
        return null;
      case 'ScrollRect':
        const scrollViewComponents = go.GetComponentsInChildren<ScrollRect>();
        for (let i = 0; i < scrollViewComponents.length; i++) {
          if (scrollViewComponents[i].name === componentName) {
            return scrollViewComponents[i];
          }
        }
        return null;
      default:
        return null;
    }
  }

  public static VectorPlusCalc(vector1: Vector3, vector2: Vector3): Vector3 {
    return new Vector3(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
  }

  public static VectorMinusCalc(vector1: Vector3, vector2: Vector3): Vector3 {
    return new Vector3(vector1.x - vector2.x, vector1.y - vector2.y, vector1.z - vector2.z);
  }

  public static VectorMultiCalc(vector1: Vector3, multi: number): Vector3 {
    return new Vector3(vector1.x * multi, vector1.y * multi, vector1.z * multi);
  }

  public static ChangeLayer(obj: GameObject, layer: string) {
    Utils.ChangeLayersRecursively(obj, layer);
  }
  public static ChangeLayersRecursively(obj: GameObject, layer: string) {
    if (obj) {
      obj.layer = LayerMask.NameToLayer(layer);
      for (let i = 0; i < obj.transform.childCount; i++) {
        Utils.ChangeLayersRecursively(obj.transform.GetChild(i).gameObject, layer);
      }
    }
  }

  public static RandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static GetThousandCommaText(datan?: number, datas?: string) {
    if (datan) {
      return datan.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
    if (datas) {
      return datas.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
    }
  }

  public static ExtractNumberStr(str: string) {
    let regex = /[^0-9]/g;
    return str.replace(regex, '');
  }
}
