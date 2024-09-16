import React from 'react';

import '../../assets/css/ResourceViewer.css';

// Renders the resource (video/powerpoint) that is part of a module
const ResourceViewer = ({ resource, title, contentRef }) => {
  const renderResource = () => {
    const { url, type } = resource;

    if (type === 'video') {
      return (
        <div className="responsive-iframe" ref={contentRef}>
          <iframe
            src={url}
            allowFullScreen
            width="100%"
            height="600"
            title={title}
          ></iframe>
        </div>
      );
    }

    if (type === 'powerpoint') {
      return (
        <iframe
          ref={contentRef}
          className="powerpoint-iframe"
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          width="510"
          height="407"
          title={title}
        ></iframe>
      );
    }

    return null;
  };

  return <>{renderResource()}</>;
};

export default ResourceViewer;
