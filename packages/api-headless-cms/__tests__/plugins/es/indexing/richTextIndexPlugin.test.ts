import richTextIndexing from "../../../../src/content/plugins/es/indexing/richTextIndexing";
import {
    CmsContentEntryType,
    CmsContentModelFieldType,
    CmsModelFieldToGraphQLPlugin
} from "@webiny/api-headless-cms/types";

const mockValue = [
    {
        tag: "p",
        content: "some long text"
    }
];
const mockContext: any = {};
const mockModel: any = {};
const mockInputEntry: Partial<CmsContentEntryType> = {
    values: {
        notAffectedNumber: 1,
        notAffectedString: "some text",
        notAffectedObject: {
            test: true
        },
        notAffectedArray: ["first", "second"],
        text: mockValue
    }
};
const mockIndexedEntry: Partial<CmsContentEntryType> & Record<string, any> = {
    values: {
        notAffectedNumber: 1,
        notAffectedString: "some text",
        notAffectedObject: {
            test: true
        },
        notAffectedArray: ["first", "second"]
    },
    rawData: {
        text: mockValue
    }
};
const mockField: CmsContentModelFieldType = {
    id: "textField",
    type: "text",
    label: "Text",
    validation: [],
    multipleValues: false,
    renderer: {
        name: "any"
    },
    fieldId: "text",
    predefinedValues: {
        enabled: false,
        values: []
    },
    placeholderText: "text",
    helpText: "text"
};
const mockFieldTypePlugin: CmsModelFieldToGraphQLPlugin = {
    type: "cms-model-field-to-graphql",
    fieldType: "text",
    isSearchable: false,
    isSortable: false,
    manage: {} as any,
    read: {} as any
};

describe("richTextIndexing", () => {
    test("toIndex should return transformed objects", () => {
        const plugin = richTextIndexing();

        const result = plugin.toIndex({
            entry: mockInputEntry as any,
            field: mockField,
            model: mockModel,
            value: mockValue,
            context: mockContext,
            fieldTypePlugin: mockFieldTypePlugin
        });

        // here we receive new values and rawData objects that are populated, in rawData case, and values being without given fieldId
        expect(result).toEqual(mockIndexedEntry);
    });

    test("fromIndex should return transformed objects", () => {
        const plugin = richTextIndexing();
        const result = plugin.fromIndex({
            entry: mockIndexedEntry as any,
            field: mockField,
            model: mockModel,
            context: mockContext,
            fieldTypePlugin: mockFieldTypePlugin
        });

        // we receive a bit different output than in toIndex since here we take field from rawData and put it into values obj
        // it is being merged into new entry after that
        expect(result).toEqual({
            values: {
                text: mockValue
            },
            rawData: {}
        });
    });
});
