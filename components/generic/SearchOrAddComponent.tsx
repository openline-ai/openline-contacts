import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {OverlayPanel} from "primereact/overlaypanel";
import {InputText} from "primereact/inputtext";
import {Skeleton} from "primereact/skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {Button} from "primereact/button";
import {faSquarePlus} from "@fortawesome/free-regular-svg-icons";

const SearchOrAddComponent = (props: any) => {

    const containerRef = useRef<OverlayPanel>(null);
    const [loadingData, setLoadingData] = useState(false);

    const [searchResultList, setSearchResultList] = useState([] as any);
    const [totalElements, setTotalElements] = useState([] as any);

    const inputValueRef = useRef('');
    const [inputValue, setInputValue] = useState(props.value);

    const [loadDataTriggered, setLoadDataTriggered] = useState(false);

    useEffect(() => {
        inputValueRef.current = inputValue;
    }, [inputValue]);

    useEffect(() => {
        setInputValue(props.value);
    }, [props.value])

    //put a delay in place to wait for more user input, to not make a hit for each char typed
    useEffect(() => {
        var timer = {} as any;
        if (loadDataTriggered) {
            timer = setTimeout(() => {
                props.searchData(inputValueRef.current, props.maxResults).then((response: any) => {
                    setSearchResultList(response.content);
                    setTotalElements(response.totalElements);
                    setLoadingData(false);
                    setLoadDataTriggered(false);
                });
            }, props.searchDelay);
        }
        return () => {
            if(timer) {
                clearTimeout(timer)
            }
        };
    }, [loadDataTriggered])

    return <>

        <InputText className="w-full" value={inputValue} onChange={(e: any) => {
            setInputValue(e.target.value);

            if (e.target.value.length > 0) {
                containerRef?.current?.show(e, null);

                setLoadingData(true);

                if (!loadDataTriggered) {
                    setLoadDataTriggered(true);
                }
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

            <div className="font-bold uppercase w-full mb-3">{props.resourceLabel}</div>

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
                                <div key={c.id} className="flex search-component-row p-2" onClick={() => {
                                    props.onItemSelected(c);
                                    containerRef?.current?.hide();
                                }}>
                                    <div className="flex flex-grow-1">
                                        {
                                            props.searchItemTemplate(c)
                                        }
                                    </div>
                                    <div className="flex pr-2">
                                        <FontAwesomeIcon size="lg" icon={faSquarePlus}/>
                                    </div>
                                </div>
                            );

                        })
                    }

                </div>
            }

            {
                !loadingData && (totalElements > props.maxResults) &&
                <>
                    <div>{totalElements} elements match your search term</div>
                    <div>Improve your search term to narrow down the results</div>
                </>
            }

        </OverlayPanel>

    </>;
}

SearchOrAddComponent.propTypes = {
    searchDelay: PropTypes.number,
    resourceLabel: PropTypes.string,
    value: PropTypes.string,
    searchData: PropTypes.func,
    searchItemTemplate: PropTypes.func,
    maxResults: PropTypes.number,
    onItemSelected: PropTypes.func,
    onInputValueChanged: PropTypes.func
}

SearchOrAddComponent.defaultProps = {
    searchDelay: 1000,
    maxResults: 25
}

export default SearchOrAddComponent
