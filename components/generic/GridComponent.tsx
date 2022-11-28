import {DataTable} from 'primereact/datatable';
import {useEffect, useRef, useState} from "react";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Fragment} from "preact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownWideShort, faArrowUpShortWide, faColumns, faFilter, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Dropdown} from "primereact/dropdown";
import PropTypes from "prop-types";
import {gql, GraphQLClient} from 'graphql-request'
import {Sidebar} from "primereact/sidebar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Divider} from "primereact/divider";
import {Checkbox} from "primereact/checkbox";
import {InputText} from "primereact/inputtext";
import {toast} from "react-toastify";


const GridComponent = (props: any) => {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [data, setData] = useState([] as any);

    const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);
    const sortContainerRef = useRef<OverlayPanel>(null);
    const configurationContainerRef = useRef<OverlayPanel>(null);

    const [sort, setSort] = useState(props.columns.filter((c: any) => c.sortFieldName).map((c: any) => {
        return {
            label: c.label,
            sortFieldName: c.sortFieldName,
            dir: 'ASC',
            active: false
        }
    }));
    const [filters, setFilters] = useState(props.filters.map((sb: any) => {
        return {
            type: sb.type ?? "TEXT",
            label: sb.label,
            fieldName: sb.fieldName,
            operation: "CONTAINS", //todo this needs to be changed when we are going to have types
            value: undefined,
            options: sb.options,
            operations: sb.operations ?? ["CONTAINS", "EQUALS"]
        };
    }));

    const onEdit = function (id: any) {
        props.onEdit(id);
    };

    const paginatorTemplate = {
        layout: 'CurrentPageReport PrevPageLink NextPageLink RowsPerPageDropdown',
        'RowsPerPageDropdown': (options: any) => {
            const dropdownOptions = [
                {label: '25', value: 25},
                {label: '50', value: 50},
                {label: '100', value: 100}
            ];

            return (
                <Fragment>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={(evt: any) => {
                        setLazyParams((prevLazyParams: any) => {
                            return {
                                ...prevLazyParams, ...{
                                    limit: evt.value
                                }
                            };
                        })
                    }}/>
                </Fragment>
            );
        },
        'CurrentPageReport': (options: any) => {
            return (
                <span className="mx-1" style={{color: 'var(--text-color)', userSelect: 'none'}}>Showing {options.first} to {options.last} of {options.totalRecords} entries</span>
            )
        }
    } as any;

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" onClick={() => loadLazyData()}/>

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        limit: 25,
        page: 1,
        sortField: '',
        sortOrder: null,
        sortOrderBE: ''
    });

    const loadLazyData = () => {
        setLoading(true);

        const wh = [] as any;

        filters.filter((f: any) => f.value).forEach((f: any) => {
            wh.push({
                "property": f.fieldName,
                "value": f.value,
                "operation": f.operation
            });
        });
        var where = undefined as any;
        switch (wh.length) {
            case 0: {
                where = undefined;
                break;
            }
            case 1: {
                where = {
                    "filter": wh[0]
                };
                break;
            }
            default: {
                where = {
                    "AND": []
                };
                wh.forEach((f: any) => {
                    where["AND"].push({
                        "filter": f
                    })
                })
            }
        }

        const params = {
            where: where,
            pagination: {
                page: lazyParams.page,
                limit: lazyParams.limit
            },
            sort: sort.filter((s: any) => s.active).map((s: any) => {
                return {
                    by: s.sortFieldName,
                    direction: s.dir,
                    caseSensitive: false
                }
            })
        } as any;

        if (props.queryData) {
            props.queryData(params).then((response: any) => {
                setData(response.content);
                setTotalRecords(response.totalElements);
                setLoading(false);
            }).catch((e: any) => {
                setTotalRecords(0);
                setLoading(false);
                //TODO show error
            });
        } else {
            var fieldsForQuery = props.columns.filter((p: any) => p.field).map((p: any) => p.field).join("\n");
            fieldsForQuery += "\nid\n";

            const query = gql`query GetList($pagination: Pagination, $where: Filter, $sort: [SortBy!]){
                ${props.hqlQuery}(pagination: $pagination, where: $where, sort: $sort){
                content {
                    ${fieldsForQuery}
                }
                totalElements
            }
            }`

            client.request(query, params).then((response: any) => {
                setData(response[props.hqlQuery].content);
                setTotalRecords(response[props.hqlQuery].totalElements);
                setLoading(false);
            }).catch((e) => {
                setTotalRecords(0);
                setLoading(false);

                //todo log an error in server side
                toast.error("There was a problem on our side and we are doing our best to solve it!");
            });
        }
    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, props.triggerReload, sort]);

    const onPage = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: (event.first / event.rows) + 1,
                    first: event.first
                }
            };
        });
    }

    return <>
        {
            props.showHeader != undefined && props.showHeader &&
            <div className="p-datatable header flex align-items-center">

                <div className="flex flex-grow-1 text-3xl">
                    {props.gridTitle}
                </div>
                <div className="flex flex-grow-1 justify-content-end">
                    {props.gridActions}
                </div>

            </div>
        }

        {
            (props.filtersEnabled || props.sortingEnabled) &&
            <div className="p-datatable filters flex">

                <div className="flex flex-grow-1">
                    {
                        props.filtersEnabled &&
                        <div className="flex align-items-center ml-1">
                            <FontAwesomeIcon icon={faFilter}/>
                            <Button onClick={() => setFiltersPanelVisible(true)} className='p-button-link'
                                    label="Filters"/>
                        </div>
                    }
                </div>
                <div className="flex flex-grow-1 justify-content-end">

                    {
                        (props.sortingEnabled || props.configurationEnabled) &&
                        <Divider layout="vertical" className="p-0"/>
                    }

                    {
                        props.sortingEnabled &&
                        <Button onClick={(e: any) => sortContainerRef?.current?.toggle(e)} className='p-button-text'>
                            <FontAwesomeIcon icon={faArrowUpShortWide} className="mr-2"/>
                            <span>Sorting</span>
                        </Button>
                    }

                    {
                        props.sortingEnabled && props.configurationEnabled &&
                        <Divider layout="vertical" className="p-0"/>
                    }

                    {
                        props.configurationEnabled &&
                        <Button onClick={(e: any) => configurationContainerRef?.current?.toggle(e)} className='p-button-text mr-1'>
                            <FontAwesomeIcon icon={faColumns} className="mr-2"/>
                            <span>Columns</span>
                        </Button>
                    }

                </div>

            </div>
        }

        <DataTable value={data} lazy responsiveLayout="scroll" dataKey="id" size={'normal'}
                   paginator paginatorTemplate={paginatorTemplate} paginatorLeft={paginatorLeft}
                   first={lazyParams.first} rows={lazyParams.limit} totalRecords={totalRecords} onPage={onPage} loading={loading}>
            {
                props.columns
                    .filter((c: any) => c.hidden === undefined || c.hidden === false)
                    .map((columnDefinition: any) => {
                        let bodyTemplate = (rowData: any) => {
                            if (columnDefinition.template) {
                                return columnDefinition.template(rowData);
                            } else if (columnDefinition.editLink) {
                                return <span className={`cta ${columnDefinition.className ?? ''}`}
                                             onClick={() => onEdit(rowData.id)}>{rowData[columnDefinition.field]}</span>
                            } else {
                                return <div className={columnDefinition.className ?? ''}>{rowData[columnDefinition.field]}</div>;
                            }
                        };
                        return <Column key={columnDefinition.field + '_' + columnDefinition.label}
                                       field={columnDefinition.field}
                                       header={columnDefinition.label}
                                       className={columnDefinition.className ?? ''}
                                       body={bodyTemplate}/>
                    })
            }
        </DataTable>

        <Sidebar visible={filtersPanelVisible} style={{width: '500px'}} onHide={() => setFiltersPanelVisible(false)} position="right">
            Filter by

            <Button className="p-button-text" onClick={() => loadLazyData()}>
                <FontAwesomeIcon size="sm" icon={faSearch}/>
            </Button>

            {
                filters?.map((f: any) => {
                    return <div className="flex flex-row mb-3" key={f.fieldName}>

                                <span className="flex flex-grow-0 mr-3">
                                    {f.label}
                                </span>
                        <span className="flex flex-grow-1 mr-3 align-items-center">

                                    {
                                        f.type === "TEXT" &&
                                        <>
                                            <InputText className="w-full mr-3" onChange={(e: any) => {
                                                setFilters(filters.map((fv: any) => {
                                                    if (fv.fieldName === f.fieldName) {
                                                        fv.value = e.target.value;
                                                    }
                                                    return fv;
                                                }));
                                            }}/>

                                            <Dropdown options={f.operations} value={f.operation} onChange={(e: any) => {
                                                setFilters(filters.map((fv: any) => {
                                                    if (fv.fieldName === f.fieldName) {
                                                        fv.operation = e.target.value;
                                                    }
                                                    return fv;
                                                }));
                                            }}/>
                                        </>
                                    }

                            {
                                f.type === "DROPDOWN" &&
                                <Dropdown options={f.options}
                                          optionValue="value" optionLabel="label"
                                          value={f.value} onChange={(e: any) => {
                                    setFilters(filters.map((fv: any) => {
                                        if (fv.fieldName === f.fieldName) {
                                            fv.value = e.target.value;
                                        }
                                        return fv;
                                    }));
                                }}/>
                            }


                                </span>

                    </div>
                })
            }

        </Sidebar>

        <OverlayPanel ref={sortContainerRef} dismissable>
            <div className="mb-3 font-bold">Select the fields you want to sort by</div>
            <div className="flex flex-column">
                {
                    sort.map((c: any) => {
                        return <div key={c.sortFieldName} className="flex flex-row mb-3">
                            <div className="flex flex-grow-1 align-items-center mr-5">
                                <Checkbox
                                    onChange={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.sortFieldName === c.sortFieldName) {
                                                s.active = e.checked;
                                            }
                                            return s;
                                        }))
                                    }}
                                    checked={c.active}
                                    className="mr-2"/>
                                <label>{c.label}</label>
                            </div>
                            <div key={c.sortFieldName} className="flex">
                                <Button
                                    onClick={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.sortFieldName === c.sortFieldName) {
                                                s.dir = "ASC";
                                            }
                                            return s;
                                        }))
                                    }}
                                    className={'sort-button mr-2' + (c.dir === "ASC" ? ' selected' : '')}>
                                    <FontAwesomeIcon icon={faArrowUpShortWide} className="mr-2"/>ASC
                                </Button>
                                <Button
                                    onClick={(e: any) => {
                                        setSort(sort.map((s: any) => {
                                            if (s.sortFieldName === c.sortFieldName) {
                                                s.dir = "DESC";
                                            }
                                            return s;
                                        }))
                                    }}
                                    className={'sort-button mr-2' + (c.dir === "DESC" ? ' selected' : '')}>
                                    <FontAwesomeIcon icon={faArrowDownWideShort}/>DESC
                                </Button>
                            </div>
                        </div>
                    })
                }

            </div>
        </OverlayPanel>

        <OverlayPanel ref={configurationContainerRef} dismissable>
            Grid configuration
            TODO
        </OverlayPanel>
    </>;
}

GridComponent.propTypes = {
    showHeader: PropTypes.bool,
    gridTitle: PropTypes.string,
    gridActions: PropTypes.object,

    filtersEnabled: PropTypes.bool,
    sortingEnabled: PropTypes.bool,
    configurationEnabled: PropTypes.bool,

    filters: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        fieldName: PropTypes.string.isRequired,

        type: PropTypes.oneOf(["TEXT", "DROPDOWN"]),

        //dropdown options
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })),

        operations: PropTypes.arrayOf(PropTypes.oneOf(["CONTAINS", "EQUALS"]))
    })),
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string,
        hidden: PropTypes.bool,
        label: PropTypes.string,
        className: PropTypes.string,
        template: PropTypes.func,
        editLink: PropTypes.bool,
        filterPlaceholder: PropTypes.string,
        sortFieldName: PropTypes.string
    })),

    triggerReload: PropTypes.bool,

    queryData: PropTypes.func, //you can load data in your component
    hqlQuery: PropTypes.string, //or the grid can load it for you

    onEdit: PropTypes.func
}

GridComponent.defaultProps = {
    filters: [],
    showHeader: true,
    gridTitle: 'Title',
    filtersEnabled: true,
    sortingEnabled: true,
    configurationEnabled: true
}

export default GridComponent
