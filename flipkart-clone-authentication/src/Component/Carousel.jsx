import React from "react";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";

const CarouselComponent = () => {
  const slides = [
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/ff79341b24d091cd.jpg?q=60",
      title: "Big Billion Days",
      subtitle: "Starting at just ₹199"
    },
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1558a721300c7f6d.jpg?q=60",
      title: "Electronics Sale",
      subtitle: "Up to 60% off"
    },
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/5b309e98775e22e4.jpg?q=60",
      title: "Fashion Festival",
      subtitle: "Min 50% off"
    },
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1221d5443fd3875e.jpeg?q=80",
      title: "Mobiles & Accessories",
      subtitle: "Best deals"
    },
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1bd9f11edbf77427.jpg?q=80",
      title: "Home & Furniture",
      subtitle: "Starting ₹999"
    },
    {
      image: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1fd821ae6c27fb56.jpg?q=80",
      title: "Grocery Sale",
      subtitle: "Extra 10% off"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="carousel-modern"
    >
      <Carousel 
        fade 
        interval={4000}
        indicators={true}
        controls={true}
        pause="hover"
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={slide.image}
              alt={`Slide ${index + 1}`}
            />
            <Carousel.Caption className="bg-gradient-dark p-4 rounded-3">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
              >
                {slide.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {slide.subtitle}
              </motion.p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </motion.div>
  );
};

export default CarouselComponent;