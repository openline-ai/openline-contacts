import {DataTable} from 'primereact/datatable';
import {useEffect, useRef, useState} from "react";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {Fragment} from "preact";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownShortWide, faColumns, faFilter} from "@fortawesome/free-solid-svg-icons";
import {Dropdown} from "primereact/dropdown";
import PropTypes from "prop-types";
import {gql, GraphQLClient} from 'graphql-request'
import {Sidebar} from "primereact/sidebar";
import {OverlayPanel} from "primereact/overlaypanel";
import {Divider} from "primereact/divider";


const GridComponent = (props: any) => {
    const client = new GraphQLClient(`${process.env.API_PATH}/query`);

    const [data, setData] = useState([] as any);

    const [filtersPanelVisible, setFiltersPanelVisible] = useState(false);
    const sortContainerRef = useRef<OverlayPanel>(null);
    const configurationContainerRef = useRef<OverlayPanel>(null);

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

        const params = {
            pagination: {
                page: lazyParams.page,
                limit: lazyParams.limit
            },
            sortOrder: lazyParams.sortOrderBE,
            sortField: lazyParams.sortField,
        } as any;

        var fieldsForQuery = props.columns.map((p: any) => p.field).join("\n");
        fieldsForQuery += "\nid\n";

        const query = gql`
            query GetList($pagination: PaginationFilter){

                ${props.hqlQuery}(paginationFilter: $pagination){
                content {
                    ${fieldsForQuery}
                }
                totalPages
                totalElements
            }

            }
        `

        client.request(query, params).then((response: any) => {
            setData(response[props.hqlQuery].content);
            setTotalRecords(response[props.hqlQuery].totalElements);
            setLoading(false);
        }).catch((e) => {
            setTotalRecords(0);
            setLoading(false);
            //TODO show error
        });

    }

    useEffect(() => {
        loadLazyData();
    }, [lazyParams, props.triggerReload]);

    const onPage = (event: any) => {
        console.log(event);
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: (event.first / event.rows) + 1,
                    first: event.first
                }
            };
        });
    }
    const onSort = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    page: prevLazyParams.page,
                    sortField: event.sortField,
                    sortOrder: event.sortOrder,
                    sortOrderBE: event.sortOrder == 1 ? 'ASC' : 'DESC',
                }
            };
        });
    }
    const onFilter = (event: any) => {
        setLazyParams((prevLazyParams: any) => {
            return {
                ...prevLazyParams, ...{
                    filters: event.filters
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
                            <FontAwesomeIcon icon={faArrowDownShortWide} className="mr-2"/>
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
                   first={lazyParams.first} rows={lazyParams.limit} totalRecords={totalRecords} onPage={onPage}
                   onFilter={onFilter} loading={loading}>
            {
                props.columns
                    .filter((c: any) => c.hidden === undefined || c.hidden === false)
                    .map((columnDefinition: any) => {
                        let bodyTemplate = (rowData: any) => {
                            if (columnDefinition.hidden !== undefined && columnDefinition.hidden === true) {
                                return;
                            } else if (columnDefinition.template) {
                                return columnDefinition.template;
                            } else if (columnDefinition.editLink) {
                                return <span className={`cta ${columnDefinition.className ?? ''}`}
                                             onClick={() => onEdit(rowData.id)}>{rowData[columnDefinition.field]}</span>
                            } else {
                                return <div
                                    className={columnDefinition.className ?? ''}>{rowData[columnDefinition.field]}</div>;
                            }
                        };
                        return <Column key={columnDefinition.field}
                                       field={columnDefinition.field}
                                       header={columnDefinition.header}
                                       className={columnDefinition.className ?? ''}
                                       body={bodyTemplate}/>
                    })
            }
        </DataTable>

        <Sidebar visible={filtersPanelVisible} onHide={() => setFiltersPanelVisible(false)} position="right">
            Filter by TODO
        </Sidebar>

        <OverlayPanel ref={sortContainerRef} dismissable>
            Sort by
            TODO
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

    resourceLabel: PropTypes.string,
    filters: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        hidden: PropTypes.bool,
        header: PropTypes.string,
        className: PropTypes.string,
        template: PropTypes.func,
        editLink: PropTypes.bool,
        filterPlaceholder: PropTypes.string,
    })),
    triggerReload: PropTypes.bool,
    hqlQuery: PropTypes.string,
    onEdit: PropTypes.func
}

GridComponent.defaultProps = {
    showHeader: true,
    gridTitle: 'Title',
    filtersEnabled: true,
    sortingEnabled: true,
    configurationEnabled: true,
}

export default GridComponent
