import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {OverlayPanel} from "primereact/overlaypanel";
import {InputText} from "primereact/inputtext";
import {Skeleton} from "primereact/skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {Button} from "primereact/button";

const SearchOrAddComponent = (props: any) => {

    const containerRef = useRef<OverlayPanel>(null);
    const [loadingData, setLoadingData] = useState(false);

    const [searchResultList, setSearchResultList] = useState([] as any);
    const [totalElements, setTotalElements] = useState([] as any);

    const [inputValue, setInputValue] = useState(props.value);

    useEffect(() => {
        setInputValue(props.value);
    }, [props.value])

    return <>

        <InputText className="w-full" value={inputValue} onChange={(e: any) => {
            setInputValue(e.target.value);

            if (e.target.value.length > 0) {
                containerRef?.current?.show(e, null);

                setLoadingData(true);
                setTimeout(() => {
                    props.searchData(e.target.value, props.maxResults).then((response: any) => {
                        setSearchResultList(response.content);
                        setTotalElements(response.totalElements);
                        setLoadingData(false);
                    })
                }, 2000);
            } else {
                containerRef?.current?.hide();
            }

            props.onInputValueChanged({
                id: undefined,
                label: e.target.value
            })
        }
        }/>

        <OverlayPanel ref={containerRef} style={{width: '500px'}}>

            {
                loadingData &&
                <div className="p-4">
                    <ul className="m-0 p-0">
                        <li className="mb-3">
                            <div className="flex">
                                <div style={{flex: '1'}}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                        <li className="">
                            <div className="flex">
                                <div style={{flex: '1'}}>
                                    <Skeleton width="100%" className="mb-2"></Skeleton>
                                    <Skeleton width="75%"></Skeleton>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            }

            {
                !loadingData &&
                <div className="mb-3">

                    {
                        searchResultList.map((c: any) => {
                            return (
                                <div key={c.id}>
                                    {
                                        props.searchItemTemplate(c)
                                    }
                                    <Button className="p-button-text p-0" onClick={() => {
                                        props.onItemSelected(c);
                                        containerRef?.current?.hide();
                                        //setInputValue(c.value);
                                    }}>
                                        <FontAwesomeIcon size="xs" icon={faCirclePlus} style={{color: 'black'}}/>
                                    </Button>
                                </div>
                            );

                        })
                    }

                </div>
            }

            {
                !loadingData && (totalElements >= props.maxResults) &&
                <>
                    <div>{totalElements} elements match your search term</div>
                    <div>Improve your search term to narrow down the results</div>
                </>
            }

        </OverlayPanel>

    </>;
}

SearchOrAddComponent.propTypes = {
    value: PropTypes.string,
    searchData: PropTypes.func,
    searchItemTemplate: PropTypes.func,
    maxResults: PropTypes.number,
    onItemSelected: PropTypes.func,
    onInputValueChanged: PropTypes.func
}

SearchOrAddComponent.defaultProps = {
    maxResults: 25
}

export default SearchOrAddComponent
