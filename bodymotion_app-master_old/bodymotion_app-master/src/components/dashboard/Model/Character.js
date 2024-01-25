import * as THREE from "three";
import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import { JOINTS } from "../../../../constants/Joints";
import Box from "./Box";

function moveJoint(joint, x, y, z) {
    /* let qw = Math.sqrt(1 + m[0] + m[4] + m[8]) / 2
     let qx = (m[5] - m[7]) / (4 * qw)
     let qy = (m[6] - m[2]) / (4 * qw)
     let qz = (m[1] - m[3]) / (4 * qw)*/

    /*   let qw = Math.sqrt(1 + m[0] + m[4] + m[8]) / 2
       let qx = (m[7] - m[5]) / (4 * qw) * -1
       let qy = (m[2] - m[6]) / (4 * qw) * -1
       let qz = (m[3] - m[1]) / (4 * qw) * -1
   
       joint.quaternion.y = qy;
       joint.quaternion.x = qx;
       joint.quaternion.z = qz;
       joint.quaternion.w = qw;*/

    joint.position.x = x * -1;
    joint.position.y = y;
    //joint.position.z = z;

}

export default function Character({ position, scale, handleData }) {
    const group = useRef();
    const gltf = useLoader(GLTFLoader, "/stacy.glb");
    const [joints, setJoints] = useState([])
    const [neck, setNeck] = useState(0, 0, 0);
    const [waist, setWaist] = useState(undefined);
    const [data, setData] = useState([{ jointDatas: [] }])
    const [refresh, setRefresh] = useState(false)
    const [load, setLoad] = useState(true)
    const [spinePosition, setSpinePosition] = useState([0, 0, 0])
    const [leftLegPosition, setleftLegPosition] = useState([-20, -50, 0])
    const [rightLegPosition, setrightLegPosition] = useState([20, -50, 0])
    const [bones, skeleton] = useMemo(() => {
        // By putting bones into the view Threejs removes it automatically from the
        // cached scene. Next time the component runs these two objects will be gone.
        // Since the gltf object is a permenently cached object, we can extend it here
        // and extend it with all the data we may need.
        if (!gltf.bones) gltf.bones = gltf.scene.children[0].children[0];
        if (!gltf.skeleton)
            gltf.skeleton = gltf.scene.children[0].children[1].skeleton;

        gltf.scene.traverse(o => {
            // Reference the neck and waist bones
            Object.keys(JOINTS).forEach(joint => {
                if (o.isBone && o.name == JOINTS[joint]) {
                    const obj = {
                        o
                    }
                    joints.push(obj);
                }
            });
            console.log(joints);
            if (o.isBone && o.name === "mixamorigNeck") {
                setNeck(o);
            }
            if (o.isBone && o.name === "mixamorigSpine") {
                setWaist(o);
            }
        });
        console.log(gltf);
        return [gltf.bones, gltf.skeleton];
    }, [gltf]);

    const texture = useLoader(TextureLoader, "/stacy.jpg");
    const actions = useRef();
    const [mixer] = useState(() => new THREE.AnimationMixer());

    useEffect(() => {
        actions.current = {
            pockets: mixer.clipAction(gltf.animations[0], group.current),
            rope: mixer.clipAction(gltf.animations[1], group.current),
            swingdance: mixer.clipAction(gltf.animations[2], group.current),
            jump: mixer.clipAction(gltf.animations[3], group.current),
            react: mixer.clipAction(gltf.animations[4], group.current),
            shrug: mixer.clipAction(gltf.animations[5], group.current),
            wave: mixer.clipAction(gltf.animations[6], group.current),
            golf: mixer.clipAction(gltf.animations[7], group.current),
            idle: mixer.clipAction(gltf.animations[8], group.current)
        };
        //actions.current.idle.play();
    }, [mixer, gltf]);

    useFrame((state, delta) => {
        mixer.update(delta);
        //props.mousePosition && neck && moveJoint(props.mousePosition, neck);
        // props.mousePosition && waist && moveJoint(props.mousePosition, waist);
        //moveJoint(waist, 0, 0, 0);
    });

    useEffect(() => {
        // moveJoint(joints[3].o, 0, 500, 0);
    }, [joints])




    useEffect(() => {
        if (handleData() != null) {
            setData(handleData());
            setLoad(true);
        }
    }, [handleData])


    const MINUTE_MS = 50;

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(true);
        }, MINUTE_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    useEffect(() => {
        if (load && refresh) {
            try {
                data[0].jointDatas.forEach((joint, i) => {
                    // Object.keys(joints).forEach((joint_key) => {
                    if (i == 1) {
                        setSpinePosition([joint.real.X * 0.30, (joint.real.Y - 300) * 0.30, 0]);
                    }

                    //});
                    //console.log(joint);
                });
            } catch {

            }
            setRefresh(false)
        }

        //console.log(data);
    }, [data])

    return (
        // dispose={null} to bail out of recursive dispose here to keep the geometry
        // without this it destroys the material and the buffergeometry on unmount
        // this is a react-three-fiber@beta feature
        <group ref={group} scale={scale} dispose={null}>
            <object3D
                name="Stacy"
                scale={[
                    50,
                    50,
                    50
                ]}
            >
                <Box position={spinePosition} scale={[10, 10, 10]} />

            </object3D>
        </group>
    );
}
