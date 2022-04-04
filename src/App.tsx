import React, { useState, useEffect, useRef } from "react";
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

  const onChildUpdate = (childKey: string) => {
    console.log("Parent- child:", childKey, "has updated");
    updateParentHeight();
  };

  // const isChildsHeightsFilled = (childsHeightsObj: IChildHeights) => {
  //   const keys = Object.keys(childsHeightsObj);
  //   const keysCount = keys?.length;
  //   return keysCount === childsList.length;
  // };

  const updateParentHeight = () => {
    const childsHeights = ChildsHeightsService.getChildsHeights();
    // console.log("Parent Heights ", childsHeights);
    // console.log("Parent Ready? ", isChildsHeightsFilled(childsHeights));
    const newHeight = sumHeights(childsHeights);
    setHeight(newHeight + 20);
  };

  // useEffect(() => {
  //   console.log("Parent Count updated ");
  //   updateParentHeight();
  // }, [childsList.length]);

  useEffect(() => {
    console.log("Parent Mounted ");
    updateParentHeight();
  }, []);

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
  // useDidUpdate(() => {
  //   console.log("child has updated");
  //   if (childRef.current) {
  //     ChildsHeightsService.setChildHeight(id, childRef.current!.offsetHeight);
  //     onChildUpdate(id);
  //   }
  // }, [counter]);

  // useEffect(() => {
  //   console.log("child did mount");
  //   if (childRef.current)
  //     ChildsHeightsService.setChildHeight(id, childRef.current!.offsetHeight);
  // }, []);

  useMutationObserver(childRef.current, (mutationList) => {
    console.log("mutationList", mutationList);
    // onChildUpdate(id);
  });

  const updateCount = () => {
    setCounter((x) => x + 1);
  };

  return (
    <div
      style={{ height: counter, background: "red", display: "flex" }}
      ref={childRef}
    >
      <p>Height : {counter}</p>
      <button onClick={updateCount}>Add Height</button>
    </div>
  );
};

function useDidUpdate(callback: () => void, deps: any[]) {
  const hasMount = useRef(false);
  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
  }, deps);
}

export default App;
