import { TopLevelSpec } from 'vega-lite';
import { authorInfo, vegaDataModelRef, vegaLiteProviderInfo } from '../common';
import { DATASET_SELECTED_NAME } from '../../constants';
import { getConfig } from '../../core/utils/config';
import { getCombinedBase64ImageWithMime } from '../../features/template';
import thumbnail from '../thumbnail';

export const vlBarGrouped: TopLevelSpec = {
    $schema: vegaLiteProviderInfo,
    data: vegaDataModelRef(),
    config: {},
    mark: {
        type: 'bar',
        tooltip: true
    },
    encoding: {
        y: {
            field: '__0__',
            type: 'nominal'
        },
        x: {
            field: '__1__',
            type: 'quantitative'
        },
        yOffset: { field: '__2__' },
        color: { field: '__2__' },
        opacity: {
            condition: {
                test: {
                    field: DATASET_SELECTED_NAME,
                    equal: 'off'
                },
                value: 0.3
            },
            value: 1
        }
    },
    usermeta: {
        information: {
            name: 'Grouped Bar Chart',
            description:
                'A simple, single-view bar chart, with a column on the Y-Axis, a measure on the X-Axis, and grouped by another categorical value (typically a column). Also enabled for tooltips and cross-filtering.',
            author: authorInfo,
            uuid: 'ca5fe45d-6b40-4638-baf8-e6c33fdf1d59',
            generated: '2021-03-26T00:00:00.000Z',
            previewImageBase64PNG: getCombinedBase64ImageWithMime(
                thumbnail.barGrouped
            )
        },
        provider: 'vegaLite',
        dataset: [
            {
                key: '__0__',
                name: 'Category',
                description:
                    "Select a column that will be displayed on the chart's Y-Axis",
                type: 'text',
                kind: 'column'
            },
            {
                key: '__1__',
                name: 'Measure',
                description:
                    "Select a measure that will be displayed on the chart's X-Axis",
                type: 'numeric',
                kind: 'measure'
            },
            {
                key: '__2__',
                name: 'Series',
                description:
                    'Select a series that will be grouped (and colored) within each category.',
                type: 'text',
                kind: 'column'
            }
        ],
        interactivity: {
            tooltip: true,
            contextMenu: true,
            selection: true,
            dataPointLimit:
                getConfig().propertyDefaults.vega.selectionMaxDataPoints
        }
    }
};
