cmake_minimum_required(VERSION 3.16)

project(patch-wizard VERSION 0.1 LANGUAGES CXX)

set(QT_DEFAULT_MAJOR_VERSION 6)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(BUILD_SHARED_LIBS NO)

find_package(QT NAMES Qt6 REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)
find_package(ZLIB REQUIRED)
add_subdirectory(${PROJECT_SOURCE_DIR}/lib/quazip)

set(TS_FILES patch-wizard_fr_FR.ts)

set(PROJECT_SOURCES
        main.cpp
        patchwizard.cpp
        patchwizard.h
        ${TS_FILES}
)

if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)
    file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/../LICENSE DESTINATION ${CMAKE_CURRENT_SOURCE_DIR})
    set(BIG_SOURCES patch.qrc)
    qt_add_big_resources(BIG_SOURCES patch.qrc)
    set_property(SOURCE patch.qrc PROPERTY SKIP_AUTORCC ON)

    qt_add_executable(patch-wizard
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES}
        ${BIG_SOURCES}
        pages/intro.h pages/intro.cpp
        pages/license.h pages/license.cpp
        pages/path.h pages/path.cpp
        pages/progress.h pages/progress.cpp
        patch.qrc
    )
# Define target properties for Android with Qt 6 as:
#    set_property(TARGET patch-wizard APPEND PROPERTY QT_ANDROID_PACKAGE_SOURCE_DIR
#                 ${CMAKE_CURRENT_SOURCE_DIR}/android)
# For more information, see https://doc.qt.io/qt-6/qt-add-executable.html#target-creation

    # qt_create_translation(QM_FILES ${CMAKE_SOURCE_DIR} ${TS_FILES})
else()
    if(ANDROID)
        add_library(patch-wizard SHARED
            ${PROJECT_SOURCES}
        )
# Define properties for Android with Qt 5 after find_package() calls as:
#    set(ANDROID_PACKAGE_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/android")
    else()
        add_executable(patch-wizard
            ${PROJECT_SOURCES}
            pages/intro.h pages/intro.cpp
            pages/license.h pages/license.cpp
            pages/path.h pages/path.cpp
            pages/progress.h pages/progress.cpp

        )
    endif()

    qt5_create_translation(QM_FILES ${CMAKE_SOURCE_DIR} ${TS_FILES})
endif()

target_link_libraries(patch-wizard PRIVATE Qt${QT_VERSION_MAJOR}::Widgets ZLIB::ZLIB QuaZip::QuaZip)

# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
if(${QT_VERSION} VERSION_LESS 6.1.0)
  set(BUNDLE_ID_OPTION MACOSX_BUNDLE_GUI_IDENTIFIER com.example.patch-wizard)
endif()
set_target_properties(patch-wizard PROPERTIES
    ${BUNDLE_ID_OPTION}
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

include(GNUInstallDirs)
install(TARGETS patch-wizard
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(patch-wizard)
endif()
