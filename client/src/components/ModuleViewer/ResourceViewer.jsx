import React from 'react';

import '../../assets/css/ResourceViewer.css';

//  renders the resource (video/powerpoint) that is part of a module

const ResourceViewer = ({ resource, title, contentRef }) => {
  const renderResource = () => {
    const url = resource.url;

    if (resource.type === 'video') {
      return (
        <div className="responsive-iframe" ref={contentRef}>
          <iframe src={url} frameBorder="0" allowFullScreen title={title}></iframe>
        </div>
      );
    }

    if (resource.type === 'powerpoint') {
      return (
        <iframe
          ref={contentRef}
          className="powerpoint-iframe"
          src={url}
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
