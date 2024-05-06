import React from 'react';
import { TableCell } from '@fluentui/react-components';

import { CappedTextField } from '../../interface';
import { useTemplateStyles } from '.';
import { TEMPLATE_DATASET_FIELD_PROPS } from '../fields';
import { DATASET_NAME } from '../../../constants';
import { UsermetaDatasetField } from '@deneb-viz/core-dependencies';

interface IDataNameColumnCellProps {
    item: UsermetaDatasetField;
    index: number;
}

/**
 * Displays a template field name as an editable field.
 */
export const DataNameColumnField: React.FC<IDataNameColumnCellProps> = ({
    item,
    index
}) => {
    const classes = useTemplateStyles();
    return (
        <TableCell className={classes.datasetColumnName}>
            <CappedTextField
                id={`${DATASET_NAME}[${index}].name`}
                i18nLabel={`${item.name}`}
                i18nPlaceholder={`${item?.namePlaceholder}`}
                maxLength={TEMPLATE_DATASET_FIELD_PROPS.name.maxLength}
                inline
            />
        </TableCell>
    );
};
