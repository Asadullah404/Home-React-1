import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const AnimatedStars = () => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });
    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} ref={ref} />
        </group>
    );
};

const Background3D = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <AnimatedStars />
            </Canvas>
        </div>
    );
};

export default Background3D;
