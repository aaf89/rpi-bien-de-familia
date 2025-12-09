package com.rpi_bien_de_familia.Config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalDate;

@Converter(autoApply = false)
public class LocalDateToStringConverter implements AttributeConverter<LocalDate, String> {

    @Override
    public String convertToDatabaseColumn(LocalDate attribute) {
        return (attribute != null) ? attribute.toString() : null;  // yyyy-MM-dd
    }

    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        return (dbData != null) ? LocalDate.parse(dbData) : null;
    }
}
