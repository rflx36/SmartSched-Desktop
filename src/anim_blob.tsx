import React, { ReactNode, useEffect } from 'react';
import anime from 'animejs';

const colors: string[] = ["#BF547B", "#AC79F2", "#9196F2", "#B6C5F2", "#F2D0BD"];

// Utility function to get a random number between min and max
const rnd = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

// Function to generate a random border radius string
const rndBorderRadius = (): string =>
  [...Array(4).keys()].map(() => rnd(30, 85) + "%").join(" ") +
  " / " +
  [...Array(4).keys()].map(() => rnd(30, 85) + "%").join(" ");

// Type for the blob configuration object
interface BlobConfig {
  id: number;
  x: number;
  y: number;
  color: string;
}

const BlobComponent = (props: { children: ReactNode }) => {
  // Function to create and add a blob to the container
  const createBlob = ({ id, x, y, color }: BlobConfig): void => {
    const card = document.querySelector(".card");
    if (!card) return;

    const blob = document.createElement("div");
    blob.id = `blob-${id}`;
    blob.classList.add("blob");
    blob.style.top = `${y}%`;
    blob.style.left = `${x}%`;
    blob.style.backgroundColor = color;
    blob.style.transform = `scale(${rnd(1.25, 2)})`;
    blob.style.borderRadius = rndBorderRadius();

    card.appendChild(blob);
    animateBlob(id);
  };

  // Function to animate a blob with given id
  const animateBlob = (id: number): void => {
    anime({
      targets: `#blob-${id}`,
      translateX: () => `+=${rnd(-25, 25)}`,
      translateY: () => `+=${rnd(-25, 25)}`,
      borderRadius: () => rndBorderRadius(),
      rotate: () => rnd(-25, 25),
      opacity: () => rnd(0.4, 0.8),
      delay: () => rnd(0, 1000),
      scale: () => rnd(1.25, 2),
      duration: 2000,
      easing: "linear",
      complete: () => animateBlob(id), // Recursive animation call
    }).play();
  };

  // Function to generate multiple blobs in the container
  const genBlobs = (): void => {
    const card = document.querySelector(".card");
    if (!card) return;

    card.innerHTML = "";
    [...Array(25).keys()].forEach((id) => {
      const x = rnd(25, 75);
      const y = rnd(25, 75);
      const color = colors[rnd(0, colors.length - 1)];
      createBlob({ x, y, color, id });
    });
  };

  // Initialize blobs and animations on component mount
  useEffect(() => {
    genBlobs();
  }, []);

  return (
    <div className="card w-[1000px] h-[1000px] relative bg-red-500" >
      {props.children}
    </div>
  );
};

export default BlobComponent;
