import React from "react";

const TopBanner = () => (
  <div className="top-banner" data-testid="top-banner">
    <div className="top-banner-track">
      {Array.from({ length: 2 }).map((_, k) => (
        <React.Fragment key={k}>
          <span>Free shipping over ₹999</span>
          <span>Members get 10% off — code WELCOME10</span>
          <span>New drops every Friday</span>
          <span>Try at home · 7-day returns</span>
          <span>Crafted by independent makers</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default TopBanner;
