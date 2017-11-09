import styled from 'styled-components';

export const FileUploadWrapper = styled.div`
  margin: 10px 0;

  .dropzone,
  .dropzone * {
    box-sizing: border-box;
  }

  .dropzone {
    min-height: 150px;
  }

  .filepicker {
    border: 2px dashed #C7C7C7;
    min-height: 60px;
    padding: 5px;
    text-align: center;
    background-color: #E1E1E1;

  }

  .dz-clickable {
    cursor: pointer;
  }

  .dz-clickable * {
    cursor: default;
  }

  .dz-clickable .dz-message,
  .dz-clickable .dz-message * {
    cursor: pointer;
  }

  .dz-started .dz-message {
    display: none;
  }

  .dz-drag-hover {
    border-style: solid;
  }

  .dz-drag-hover .dz-message {
    opacity: 0.5;
  }

  .dz-message {
    text-align: center;
    margin: 2em 0;
  }

  .dz-preview {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin: 16px;
    min-height: 100px;
  }

  .dz-preview:hover {
    z-index: 1000;
  }

  .dz-preview:hover .dz-details {
    opacity: 1;
  }

  .dz-preview.dz-file-preview .dz-image {
    border-radius: 10px;
    background: #999;
    background: linear-gradient(to bottom, #eee, #ddd);
  }

  .dz-preview.dz-file-preview .dz-details {
    opacity: 1;
  }

  .dz-preview.dz-image-preview .dz-details {
    transition: opacity 0.2s linear;
  }

  .dz-preview .dz-remove {
    font-size: 14px;
    text-align: center;
    display: block;
    cursor: pointer;
    border: none;
  }

  .dz-preview .dz-remove:hover {
    text-decoration: underline;
  }
  .dz-preview:hover .dz-details {
    opacity: 1;
  }

  .dz-preview .dz-details {
    z-index: 20;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    font-size: 13px;
    min-width: 100%;
    max-width: 100%;
    padding: 2em 1em;
    text-align: center;
    color: rgba(0, 0, 0, 0.9);
    line-height: 150%
  }

  .dz-preview .dz-details .dz-size {
    margin-bottom: 1em;
    font-size: 16px
  }

  .dz-preview .dz-details .dz-filename {
    white-space: nowrap;
  }

  .dz-preview .dz-details .dz-filename:hover span {
    border: 1px solid rgba(200, 200, 200, 0.8);
    background-color: rgba(255, 255, 255, 0.8);
  }

  .dz-preview .dz-details .dz-filename:not(:hover) {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dz-preview .dz-details .dz-filename:not(:hover) span {
    border: 1px solid transparent;
  }

  .dz-preview .dz-details .dz-filename span,
  .dz-preview .dz-details .dz-size span {
    background-color: rgba(255, 255, 255, 0.4);
    padding: 0 0.4em;
    border-radius: 3px
  }

  .dz-preview:hover .dz-image img {
    transform: scale(1.05, 1.05);
    filter: blur(8px)
  }

  .dz-preview .dz-image {
    border-radius: 20px;
    overflow: hidden;
    width: 120px;
    height: 120px;
    position: relative;
    display: block;
    z-index: 10
  }

  .dz-preview .dz-image img {
    display: block
  }

  .dz-preview.dz-success .dz-success-mark {
    animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1)
  }

  .dz-preview.dz-error .dz-error-mark {
    opacity: 1;
    display: none;
    animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1)
  }

  .dz-preview .dz-success-mark,
  .dz-preview .dz-error-mark {
    pointer-events: none;
    opacity: 0;
    z-index: 500;
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    margin-left: -27px;
    margin-top: -27px
  }

  .dz-preview .dz-success-mark svg,
  .dz-preview .dz-error-mark svg {
    display: block;
    width: 54px;
    height: 54px
  }

  .dz-preview.dz-processing .dz-progress {
    opacity: 1;
    transition: all 0.2s linear
  }
  
  .dz-preview.dz-complete .dz-progress {
    opacity: 0;
    transition: opacity 0.4s ease-in
  }

  .dz-preview:not(.dz-processing) .dz-progress {
    animation: pulse 6s ease infinite
  }

  .dz-preview .dz-progress {
    opacity: 1;
    z-index: 1000;
    pointer-events: none;
    position: absolute;
    height: 16px;
    left: 50%;
    top: 50%;
    margin-top: -8px;
    width: 80px;
    margin-left: -40px;
    background: rgba(255, 255, 255, 0.9);
    -webkit-transform: scale(1);
    border-radius: 8px;
    overflow: hidden;
  }

  .dz-preview .dz-progress .dz-upload {
    background: #333;
    background: linear-gradient(to bottom, #666, #444);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 0;
    transition: width 300ms ease-in-out
  }

  .dz-preview.dz-error .dz-error-message {
    display: block;
  }

  .dz-preview.dz-error:hover .dz-error-message {
    opacity: 1;
    pointer-events: auto;
  }

  .dz-preview .dz-error-message {
    pointer-events: none;
    z-index: 1000;
    position: absolute;
    display: block;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 8px;
    font-size: 13px;
    top: 130px;
    left: -10px;
    width: 140px;
    background: #be2626;
    background: linear-gradient(to bottom, #be2626, #a92222);
    padding: 0.5em 1.2em;
    color: white
  }

  .dz-preview .dz-error-message:after {
    content: '';
    position: absolute;
    top: -6px;
    left: 64px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #be2626
  }

`;
