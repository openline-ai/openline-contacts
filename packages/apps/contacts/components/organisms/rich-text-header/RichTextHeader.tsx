import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";

export const RichTextHeader = ({inputRef,handleFileChange, handleUploadClick }: any) => {
    return (
        <span className="ql-formats">

                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike"></button>

                <button className="ql-link" aria-label="Link"></button>
                <button className="ql-code-block" aria-label="Code block"></button>
                <button className="ql-blockquote" aria-label="Blockquote"></button>

                <button id="custom-button" type={"button"} aria-label="Insert picture" onClick={() => handleUploadClick()}>
                    <FontAwesomeIcon size="xs" icon={faImage} style={{color: '#6c757d'}}/>
                </button>

                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />

            </span>
    );
}
