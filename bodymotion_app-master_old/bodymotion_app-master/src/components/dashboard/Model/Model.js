import React, { Suspense, useContext, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useThree, useRender, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MotionTronicDataContext } from "../../../../pages/dashboard";
import Character from "./Character";

extend({ OrbitControls });
const Controls = props => {
  const { gl, camera } = useThree();
  const ref = useRef();
 // useRender(() => ref.current.update());
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />;
};

function Plane({ ...props }) {
  return (
    <mesh {...props} receiveShadow>
      <planeGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
      <meshLambertMaterial
        attach="material"
        color="#272727"
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}
const d = 8.25;

export default function Model() {
  const motionTronicData = useContext(MotionTronicDataContext)
  const [mousePosition, setMousePosition] = useState({});
  const [data, setData] = useState(null)



const handleData = useCallback(() => {
  return motionTronicData;
}, [motionTronicData])

  return (
    <>
      <div style={{position: 'absolute', backgroundColor: '#000'}} />
      <Canvas
      style={{backgroundColor: '#000'}}
        shadowMap
        pixelRatio={window.devicePixelRatio}
        camera={{ position: [0, 0, -45], scale: [1, 1, 1] }}
        gl2
      >
        <hemisphereLight
          skyColor={"black"}
          groundColor={0xffffff}
          intensity={0.68}
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[-8, 12, 8]}
          shadowCameraLeft={d * -1}
          shadowCameraBottom={d * -1}
          shadowCameraRight={d}
          shadowCameraTop={d}
          shadowCameraNear={0.1}
          shadowCameraFar={1500}
          castShadow
        />
        <Plane rotation={[0, 0, 0]} position={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Character
            handleData={handleData}
            position={[0, -10, 0]}
            scale={[0.003, 0.003, 0.003]}
          />
        </Suspense>
        <Controls
          dampingFactor={0.5}
          rotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="layer" />
    </>
  );
}
