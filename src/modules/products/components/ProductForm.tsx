import SearchInput from "@/components/SearchInput";
import { useAppDispatch, useAppSelector } from "@/hooks/state";
import useDebounce from "@/hooks/useDebounce";
import AppCheck from "@/modules/shared/AppCheck";
import CategorySelector from "@/modules/shared/CategorySelector";
import StatusSelector from "@/modules/shared/StatusSelector";
import {
    setCurrentSelections,
    setProductFetchingStates,
    setProductState,
} from "@/store/slices/product";
import { Button, Input, Slider, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";

export function ProductNameInput() {
    const [value, setValue] = useState(
        useAppSelector(
            (state) => state.product.product_management.product_name,
        ) || "",
    );
    const dispatch = useAppDispatch();
    const debounce = useDebounce(value, 300);

    useEffect(() => {
        if (debounce) {
            dispatch(setProductState({ product_name: debounce }));
        }
    }, [debounce]);

    return (
        <Input
            label="Name"
            radius="sm"
            size="sm"
            className="min-w-[150px] max-w-[180px]"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export function ProductDescriptionInput() {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(
        useAppSelector(
            (state) => state.product.product_management.product_description,
        ) || "",
    );
    const [error, setError] = useState("");
    const debounce = useDebounce(value, 300);

    useEffect(() => {
        if (debounce) {
            dispatch(setProductState({ product_description: value }));
        }
    }, [debounce]);

    return (
        <Textarea
            placeholder="Enter your description"
            size="lg"
            radius="sm"
            value={value}
            onChange={(e) => {
                if (e.target.value.length < 120) {
                    setValue(e.target.value);
                    if (error.length > 0) {
                        setError("");
                    }
                } else {
                    setError("limit exceeded");
                }
            }}
            minRows={4}
            isInvalid={error.length > 1 ? true : false}
            errorMessage={error}
            classNames={{
                base: "h-[90px]",
                label: "hidden",
            }}
        />
    );
}

export function ProductPrice() {
    const { product_price: price } = useAppSelector(
        (state) => state.product.product_management,
    );
    return (
        <div className={`flex`}>
            <Button
                className={`h-[40px]  bg-red-500 rounded-md rounded-r-none text-white`}
                isDisabled
            >
                Price
            </Button>
            <Input
                type="number"
                value={`${price}`}
                radius="none"
                classNames={{
                    base: "w-[100px] h-[40px]",
                    inputWrapper: "rounded-r-md h-[40px]",
                    input: "price-input",
                }}
            />
        </div>
    );
}

export function ProductCheck() {
    const featured = useAppSelector(
        (state) => state.product.product_management.product_featured,
    );
    console.log(featured, "inside check");
    const dispatch = useAppDispatch();
    return (
        <AppCheck
            text="Featured"
            isSelected={featured}
            onValueChange={(e) =>
                dispatch(setProductState({ product_featured: e }))
            }
        />
    );
}

export function ProductSearchInput() {
    const [value, setValue] = useState("");
    const dispatch = useAppDispatch();

    const handleSearchClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            dispatch(
                setProductFetchingStates({
                    product_name: value,
                }),
            );
        }
    };

    return (
        <SearchInput
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
            }}
            className="flex-grow"
            containerClassName="w-[253px]"
            onKeyDown={handleSearchClick}
            onButtonPress={handleSearchClick}
        />
    );
}

const statuses = [
    {
        key: "All",
        value: "All",
    },
    {
        key: "Draft",
        value: "Draft",
    },
    {
        key: "Published",
        value: "Published",
    },
];
export function FetchingProductStatusSelector() {
    const status = useAppSelector(
        (state) => state.product.fetching_states.product_status,
    );
    const dispatch = useAppDispatch();
    return (
        <StatusSelector
            onChange={(e) => {
                if (!e.target.value) return;
                dispatch(
                    setProductFetchingStates({
                        product_status: e.target.value as any,
                    }),
                );
            }}
            label="Show"
            selectedKeys={[status]}
            items={statuses}
        />
    );
}

const productStatuses = [
    {
        key: "Draft",
        value: "Draft",
    },
    {
        key: "Published",
        value: "Published",
    },
];
export function ProductStatusSelector() {
    const status = useAppSelector(
        (state) => state.product.product_management.product_status,
    );
    const dispatch = useAppDispatch();
    return (
        <StatusSelector
            items={productStatuses}
            label="status"
            selectedKeys={[status]}
            onChange={(e) => {
                if (!e.target.value) return;
                dispatch(
                    setProductState({
                        product_status: e.target.value as any,
                    }),
                );
            }}
        />
    );
}

export function ProductCategorySelector() {
    const dispatch = useAppDispatch();
    const category = useAppSelector(
        (state) => state.product.product_management.product_category,
    );
    return (
        <CategorySelector
            selectedKey={category ? category : undefined}
            setSelectedCategory={(e) => {
                console.log(e);
                dispatch(setCurrentSelections(e as string));
            }}
        />
    );
}

export function ProductPriceRange() {
    const range = useAppSelector(
        (state) => state.product.fetching_states.range,
    );
    const dispatch = useAppDispatch();
    return (
        <Slider
            label="Price"
            className="mb-2"
            onChangeEnd={(e) =>
                dispatch(
                    setProductFetchingStates({ range: e as [number, number] }),
                )
            }
            size="sm"
            step={1}
            minValue={0}
            maxValue={20000}
            defaultValue={range}
            formatOptions={{
                style: "currency",
                currency: "INR",
            }}
        />
    );
}
