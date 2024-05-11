import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 

const Particle = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
        background: {
            color: "#151515"
          },
          particles: {
            color: { value: "#fff" },
            move: {
              direction: "bottom",
              enable: true,
              outModes: "out",
              speed: 2
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 400
            },
            opacity: {
              value: 0.7
            },
            shape: {
              type: "circle"
            },
            size: {
              value: 10
            },
            wobble: {
              enable: true,
              distance: 10,
              speed: 10
            },
            zIndex: {
              value: { min: 0, max: 100 }
            }
          }
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    );
  }

  return <></>;
};

export default Particle;