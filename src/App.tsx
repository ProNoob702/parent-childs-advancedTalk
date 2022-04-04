import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChildsHeightsService } from "./childsHeights.service";
import { IChildHeights } from "./redux-store/slice";
import { useMutationObserver } from "./useMutationObserver";

const rawChildsList: string[] = ["child1", "child2", "child3"];

const sumHeights = (childsHeights: IChildHeights): number => {
  const keys = Object.keys(childsHeights);
  let sum = 0;
  keys.forEach((key) => {
    sum += childsHeights[key];
  });
  return sum;
};

const App: React.FC<{}> = () => {
  const [childsList, setChildsList] = useState(rawChildsList);
  const [height, setHeight] = useState(0);

  const handleInpuBlur = (e: React.FocusEvent<any>) => {
    const newValue = e.currentTarget.value;
    const newList = [...childsList, newValue];
    setChildsList(newList);
  };

  const updateParentHeight = useCallback(() => {
    const childsHeights = ChildsHeightsService.getChildsHeights();
    console.log("Parent Heights ", childsHeights);
    console.log("Parent Ready? ", isChildsHeightsFilled());
    const newHeight = sumHeights(childsHeights);
    setHeight(newHeight + 20);
  }, [setHeight, childsList]);

  const onChildUpdate = useCallback(
    (childKey: string) => {
      console.log("Parent- child:", childKey, "has updated");
      updateParentHeight();
    },
    [updateParentHeight]
  );

  const isChildsHeightsFilled = () => {
    const childsHeights = ChildsHeightsService.getChildsHeights();
    const keys = Object.keys(childsHeights);
    const keysCount = keys?.length;
    return keysCount === childsList.length;
  };

  // useEffect(() => {
  //   console.log("Parent Count updated ");
  //   updateParentHeight();
  // }, [childsList.length]);

  useEffect(() => {
    console.log("Parent Mounted ");
    updateParentHeight();
  }, [updateParentHeight]);

  return (
    <>
      <div
        className="zouza"
        style={{
          minHeight: height,
          background: "blue",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {childsList.map((x) => (
          <ChildHasChanges key={x} id={x} onChildUpdate={onChildUpdate} />
        ))}
        Parent Height : {height} (Chils Heights + 20)
      </div>
      <div className="editingZone">
        <p> Add New Child</p>
        <input type="text" onBlur={handleInpuBlur} />
      </div>
    </>
  );
};

interface IChildProps {
  onChildUpdate: (childKey: string) => void;
  id: string;
}

const ChildHasChanges: React.FC<IChildProps> = ({ onChildUpdate, id }) => {
  const [counter, setCounter] = useState(50);
  const childRef = React.useRef<HTMLDivElement | any>();
  const childTextRef = React.useRef<HTMLDivElement | any>();

  useEffect(() => {
    console.log("child did mount");
    if (childRef.current)
      ChildsHeightsService.setChildHeight(id, childRef.current!.offsetHeight);
  }, []);

  const onListMutation = useCallback(
    (mutationList: MutationRecord[]) => {
      const mutation = mutationList?.[0];
      if (!mutation) return;
      const isAttributesMutation = mutation.type === "attributes";
      if (!isAttributesMutation) return;
      const child = childRef.current as HTMLElement;
      const newHeight = child.clientHeight;
      ChildsHeightsService.setChildHeight(id, newHeight);
      onChildUpdate(id);
    },
    [id, onChildUpdate]
  );

  useMutationObserver(childRef.current, onListMutation);

  const updateCount = () => {
    setCounter((x) => x + 1);
  };

  return (
    <div style={{ background: "red", display: "flex" }} ref={childRef}>
      <p ref={childTextRef} style={{ height: counter }}>
        Height : {counter}
      </p>
      <button onClick={updateCount}>Add Height</button>
    </div>
  );
};

export default App;
