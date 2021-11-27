import dayjs from 'dayjs';
import React, { useState, useRef, forwardRef } from 'react';
import { useUncontrolled, useMergedRef, upperFirst } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/core';
import { FirstDayOfWeek } from '../../types';
import { CalendarSettings } from '../Calendar/Calendar';
import { RangeCalendar } from '../RangeCalendar/RangeCalendar';
import { DatePickerBase, DatePickerBaseSharedProps } from '../DatePickerBase/DatePickerBase';

// @ts-ignore
export interface DateRangePickerProps
  extends DatePickerBaseSharedProps,
    Omit<CalendarSettings, 'size'> {
  /** Selected date, required with controlled input */
  value?: [Date, Date];

  /** Called when date range changes */
  onChange?(value: [Date | null, Date | null]): void;

  /** Default value for uncontrolled input */
  defaultValue?: [Date, Date];

  /** Set to false to force dropdown to stay open after date was selected */
  closeCalendarOnChange?: boolean;

  /** dayjs input format */
  inputFormat?: string;

  /** Control initial dropdown opened state */
  initiallyOpened?: boolean;

  /** Input name, useful fon uncontrolled variant to capture data with native form */
  name?: string;

  /** Separator between dates */
  labelSeparator?: string;

  /** Set first day of the week */
  firstDayOfWeek?: FirstDayOfWeek;

  /** Allow one date to be selected as range */
  allowSingleDateInRange?: boolean;

  /** Allows to show multiple months */
  amountOfMonths?: number;
}

const validationRule = (val: any) =>
  Array.isArray(val) && val.length === 2 && val.every((v) => v instanceof Date);

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      defaultValue,
      classNames,
      styles,
      shadow = 'sm',
      locale = 'en',
      inputFormat,
      transitionDuration = 200,
      transitionTimingFunction,
      nextMonthLabel,
      previousMonthLabel,
      closeCalendarOnChange = true,
      labelFormat = 'MMMM YYYY',
      withSelect = false,
      yearsRange,
      dayClassName,
      dayStyle,
      disableOutsideEvents,
      minDate,
      maxDate,
      excludeDate,
      initialMonth,
      initiallyOpened = false,
      name = 'date',
      size = 'sm',
      dropdownType = 'popover',
      labelSeparator = '–',
      clearable = true,
      clearButtonLabel,
      firstDayOfWeek = 'monday',
      allowSingleDateInRange = false,
      amountOfMonths = 1,
      withinPortal = false,
      ...others
    }: DateRangePickerProps,
    ref
  ) => {
    const theme = useMantineTheme();
    const dateFormat = inputFormat || theme.dateFormat;
    const [dropdownOpened, setDropdownOpened] = useState(initiallyOpened);
    const calendarSize = size === 'lg' || size === 'xl' ? 'md' : 'sm';
    const inputRef = useRef<HTMLInputElement>();
    const [_value, setValue] = useUncontrolled<[Date, Date]>({
      value,
      defaultValue,
      finalValue: [null, null],
      onChange,
      rule: validationRule,
    });

    const handleValueChange = (range: [Date, Date]) => {
      setValue(range);
      window.setTimeout(() => inputRef.current?.focus(), 0);
      closeCalendarOnChange && validationRule(range) && setDropdownOpened(false);
    };

    const valueValid = validationRule(_value);

    const handleClear = () => {
      setValue([null, null]);
      setDropdownOpened(true);
      inputRef.current?.focus();
    };

    return (
      <>
        <DatePickerBase
          dropdownOpened={dropdownOpened}
          setDropdownOpened={setDropdownOpened}
          shadow={shadow}
          transitionDuration={transitionDuration}
          ref={useMergedRef(ref, inputRef)}
          size={size}
          styles={styles}
          classNames={classNames}
          inputLabel={
            valueValid
              ? `${upperFirst(
                  dayjs(_value[0]).locale(locale).format(dateFormat)
                )} ${labelSeparator} ${upperFirst(
                  dayjs(_value[1]).locale(locale).format(dateFormat)
                )}`
              : ''
          }
          __staticSelector="DateRangePicker"
          dropdownType={dropdownType}
          clearable={clearable && valueValid}
          clearButtonLabel={clearButtonLabel}
          onClear={handleClear}
          withinPortal={withinPortal}
          {...others}
        >
          <RangeCalendar
            classNames={classNames}
            styles={styles}
            locale={locale}
            nextMonthLabel={nextMonthLabel}
            previousMonthLabel={previousMonthLabel}
            initialMonth={valueValid ? _value[0] : initialMonth}
            value={_value}
            onChange={handleValueChange}
            labelFormat={labelFormat}
            withSelect={withSelect}
            yearsRange={yearsRange}
            dayClassName={dayClassName}
            dayStyle={dayStyle}
            disableOutsideEvents={disableOutsideEvents}
            minDate={minDate}
            maxDate={maxDate}
            excludeDate={excludeDate}
            __staticSelector="DateRangePicker"
            fullWidth={dropdownType === 'modal'}
            firstDayOfWeek={firstDayOfWeek}
            size={dropdownType === 'modal' ? 'lg' : calendarSize}
            allowSingleDateInRange={allowSingleDateInRange}
            amountOfMonths={amountOfMonths}
          />
        </DatePickerBase>

        <input
          type="hidden"
          name={`${name}-from`}
          value={valueValid ? _value[0].toISOString() : ''}
        />

        <input
          type="hidden"
          name={`${name}-to`}
          value={valueValid ? _value[1].toISOString() : ''}
        />
      </>
    );
  }
);

DateRangePicker.displayName = '@mantine/dates/DateRangePicker';
